import EmailAccount from '../models/EmailAccount.js';
import EmailMessage from '../models/EmailMessage.js';
import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';

/**
 * Crear una nueva cuenta de correo
 */
export const createEmailAccount = async (req, res) => {
  try {
    const { accountName, email, provider, password, customConfig } = req.body;

    // Verificar si ya existe una cuenta con este email para este usuario
    const existingAccount = await EmailAccount.findOne({
      user: req.user._id,
      email: email.toLowerCase()
    });

    if (existingAccount) {
      return res.status(400).json({ message: 'Ya existe una cuenta con este correo electrónico' });
    }

    // Obtener configuración del proveedor o usar configuración personalizada
    let config;
    if (provider !== 'custom') {
      config = EmailAccount.getProviderConfig(provider);
      if (!config) {
        return res.status(400).json({ message: 'Proveedor no soportado' });
      }
    } else {
      config = customConfig;
    }

    // Crear la cuenta
    const account = new EmailAccount({
      user: req.user._id,
      accountName,
      email: email.toLowerCase(),
      provider,
      ...config
    });

    // Encriptar contraseña
    account.encryptedPassword = account.encryptPassword(password);

    // Validar conexión antes de guardar
    try {
      await testConnection(account, password);
    } catch (error) {
      return res.status(400).json({
        message: 'No se pudo conectar con el servidor de correo',
        error: error.message
      });
    }

    await account.save();

    res.status(201).json({
      _id: account._id,
      accountName: account.accountName,
      email: account.email,
      provider: account.provider,
      syncEnabled: account.syncEnabled,
      unreadEmails: account.unreadEmails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener todas las cuentas de correo del usuario
 */
export const getEmailAccounts = async (req, res) => {
  try {
    const accounts = await EmailAccount.find({
      user: req.user._id
    }).select('-encryptedPassword');

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Actualizar una cuenta de correo
 */
export const updateEmailAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const account = await EmailAccount.findOne({
      _id: id,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    // Si se actualiza la contraseña, encriptarla
    if (updates.password) {
      account.encryptedPassword = account.encryptPassword(updates.password);
      delete updates.password;
    }

    Object.assign(account, updates);
    await account.save();

    res.json({
      _id: account._id,
      accountName: account.accountName,
      email: account.email,
      provider: account.provider,
      syncEnabled: account.syncEnabled,
      unreadEmails: account.unreadEmails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Eliminar una cuenta de correo
 */
export const deleteEmailAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await EmailAccount.findOne({
      _id: id,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    // Eliminar todos los mensajes asociados
    await EmailMessage.deleteMany({ account: id });

    await account.deleteOne();

    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Sincronizar emails de una cuenta
 */
export const syncEmails = async (req, res) => {
  try {
    const { id } = req.params;
    const { folder = 'INBOX', limit = 50 } = req.query;

    const account = await EmailAccount.findOne({
      _id: id,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    const password = account.decryptPassword();

    // Conectar con IMAP y obtener emails
    const emails = await fetchEmailsFromIMAP(account, password, folder, limit);

    // Guardar emails en la base de datos
    let savedCount = 0;
    for (const emailData of emails) {
      try {
        await EmailMessage.findOneAndUpdate(
          {
            user: req.user._id,
            account: account._id,
            messageId: emailData.messageId
          },
          emailData,
          { upsert: true, new: true }
        );
        savedCount++;
      } catch (err) {
        console.error('Error guardando email:', err.message);
      }
    }

    // Actualizar estadísticas de la cuenta
    account.totalEmails = await EmailMessage.countDocuments({
      user: req.user._id,
      account: account._id
    });
    account.unreadEmails = await EmailMessage.getUnreadCount(req.user._id, account._id);
    account.lastSync = new Date();
    await account.save();

    res.json({
      message: 'Sincronización completada',
      emailsSynced: savedCount,
      totalEmails: account.totalEmails,
      unreadEmails: account.unreadEmails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener emails de una cuenta
 */
export const getEmails = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { folder = 'INBOX', page = 1, limit = 50, search } = req.query;

    let emails;
    if (search) {
      emails = await EmailMessage.search(
        req.user._id,
        accountId,
        search,
        parseInt(page),
        parseInt(limit)
      );
    } else {
      emails = await EmailMessage.getByFolder(
        req.user._id,
        accountId,
        folder,
        parseInt(page),
        parseInt(limit)
      );
    }

    const total = await EmailMessage.countDocuments({
      user: req.user._id,
      account: accountId,
      folder: search ? undefined : folder
    });

    res.json({
      emails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener un email específico
 */
export const getEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const email = await EmailMessage.findOne({
      _id: id,
      user: req.user._id
    });

    if (!email) {
      return res.status(404).json({ message: 'Email no encontrado' });
    }

    // Marcar como leído automáticamente
    if (!email.isRead) {
      await email.markAsRead();
    }

    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Marcar email como leído/no leído
 */
export const toggleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const email = await EmailMessage.findOne({
      _id: id,
      user: req.user._id
    });

    if (!email) {
      return res.status(404).json({ message: 'Email no encontrado' });
    }

    if (email.isRead) {
      await email.markAsUnread();
    } else {
      await email.markAsRead();
    }

    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Alternar estrella en email
 */
export const toggleStar = async (req, res) => {
  try {
    const { id } = req.params;

    const email = await EmailMessage.findOne({
      _id: id,
      user: req.user._id
    });

    if (!email) {
      return res.status(404).json({ message: 'Email no encontrado' });
    }

    await email.toggleStar();

    res.json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Enviar un email
 */
export const sendEmail = async (req, res) => {
  try {
    const { accountId, to, subject, text, html, attachments } = req.body;

    const account = await EmailAccount.findOne({
      _id: accountId,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    const password = account.decryptPassword();

    // Crear transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: account.smtpHost,
      port: account.smtpPort,
      secure: account.smtpSecure,
      auth: {
        user: account.email,
        pass: password
      }
    });

    // Enviar email
    const info = await transporter.sendMail({
      from: `"${account.accountName}" <${account.email}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text,
      html,
      attachments
    });

    res.json({
      message: 'Email enviado exitosamente',
      messageId: info.messageId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Eliminar un email
 */
export const deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const email = await EmailMessage.findOne({
      _id: id,
      user: req.user._id
    });

    if (!email) {
      return res.status(404).json({ message: 'Email no encontrado' });
    }

    await email.deleteOne();

    res.json({ message: 'Email eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ FUNCIONES AUXILIARES ============

/**
 * Probar conexión con el servidor de correo
 */
async function testConnection(account, password) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: account.email,
      password: password,
      host: account.imapHost,
      port: account.imapPort,
      tls: account.imapSecure,
      tlsOptions: { rejectUnauthorized: false }
    });

    imap.once('ready', () => {
      imap.end();
      resolve();
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.connect();
  });
}

/**
 * Obtener emails desde IMAP
 */
async function fetchEmailsFromIMAP(account, password, folder, limit) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: account.email,
      password: password,
      host: account.imapHost,
      port: account.imapPort,
      tls: account.imapSecure,
      tlsOptions: { rejectUnauthorized: false }
    });

    const emails = [];

    imap.once('ready', () => {
      imap.openBox(folder, true, (err, box) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        const totalMessages = box.messages.total;
        if (totalMessages === 0) {
          imap.end();
          return resolve([]);
        }

        // Obtener los últimos 'limit' mensajes
        const start = Math.max(1, totalMessages - limit + 1);
        const end = totalMessages;

        const fetch = imap.seq.fetch(`${start}:${end}`, {
          bodies: '',
          struct: true
        });

        fetch.on('message', (msg, seqno) => {
          let emailData = {};

          msg.on('body', (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error('Error parsing email:', err);
                return;
              }

              emailData = {
                user: account.user,
                account: account._id,
                messageId: parsed.messageId || `${seqno}@${account.email}`,
                uid: seqno,
                from: {
                  name: parsed.from?.text?.split('<')[0]?.trim() || '',
                  address: parsed.from?.value?.[0]?.address || ''
                },
                to: parsed.to?.value?.map(addr => ({
                  name: addr.name || '',
                  address: addr.address || ''
                })) || [],
                cc: parsed.cc?.value?.map(addr => ({
                  name: addr.name || '',
                  address: addr.address || ''
                })) || [],
                subject: parsed.subject || '(Sin asunto)',
                textBody: parsed.text || '',
                htmlBody: parsed.html || '',
                date: parsed.date || new Date(),
                folder: folder,
                attachments: parsed.attachments?.map(att => ({
                  filename: att.filename,
                  contentType: att.contentType,
                  size: att.size
                })) || [],
                size: parsed.size || 0,
                inReplyTo: parsed.inReplyTo || null,
                references: parsed.references || []
              };
            });
          });

          msg.once('attributes', (attrs) => {
            emailData.flags = attrs.flags || [];
            emailData.isRead = attrs.flags?.includes('\\Seen') || false;
            emailData.isStarred = attrs.flags?.includes('\\Flagged') || false;
            emailData.uid = attrs.uid;
          });

          msg.once('end', () => {
            if (emailData.messageId) {
              emails.push(emailData);
            }
          });
        });

        fetch.once('error', (err) => {
          imap.end();
          reject(err);
        });

        fetch.once('end', () => {
          imap.end();
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.once('end', () => {
      resolve(emails);
    });

    imap.connect();
  });
}

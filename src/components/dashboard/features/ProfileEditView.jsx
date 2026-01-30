import { useState } from 'react';
import { User, Camera, Save, Upload } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import ImageCropModal from './ImageCropModal';

/**
 * Vista de edición de perfil
 * Permite al usuario modificar su foto de perfil, portada, nombre y bio
 */
const ProfileEditView = () => {
  const { user, updateUser, uploadProfileImage, uploadCoverImage } = useAuth();

  // Estados para los campos editables
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || null,
    coverImage: user?.coverImage || null
  });

  const [previewImages, setPreviewImages] = useState({
    profile: user?.profileImage || null,
    cover: user?.coverImage || null
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Estados para el modal de recorte
  const [cropModal, setCropModal] = useState({
    isOpen: false,
    imageType: null,
    imageSrc: null
  });

  /**
   * Maneja los cambios en los inputs de texto
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja la selección de imagen (perfil o portada)
   */
  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'La imagen no debe superar los 5MB' });
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Solo se permiten archivos de imagen' });
        return;
      }

      // Leer archivo y abrir modal de recorte
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropModal({
          isOpen: true,
          imageType,
          imageSrc: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Maneja el resultado del recorte de imagen
   */
  const handleCropComplete = (croppedImage) => {
    const { imageType } = cropModal;

    // Actualizar preview e imágenes
    setPreviewImages(prev => ({
      ...prev,
      [imageType]: croppedImage
    }));
    setFormData(prev => ({
      ...prev,
      [`${imageType}Image`]: croppedImage
    }));

    // Cerrar modal
    setCropModal({ isOpen: false, imageType: null, imageSrc: null });
  };

  /**
   * Cierra el modal de recorte
   */
  const handleCloseCropModal = () => {
    setCropModal({ isOpen: false, imageType: null, imageSrc: null });
  };

  /**
   * Guarda los cambios del perfil
   */
  const handleSave = async () => {
    console.log('🔄 Iniciando guardado de perfil...');
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Validar campos requeridos
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        throw new Error('El nombre y apellido son obligatorios');
      }

      console.log('📊 FormData:', { ...formData, profileImage: formData.profileImage ? 'base64...' : null, coverImage: formData.coverImage ? 'base64...' : null });

      // 1. Subir imagen de portada si cambió
      if (formData.coverImage && formData.coverImage.startsWith('data:image')) {
        console.log('📤 Subiendo imagen de portada...');
        const blob = await fetch(formData.coverImage).then(r => r.blob());
        const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
        console.log('📦 Archivo de portada:', file.size, 'bytes');
        const result = await uploadCoverImage(file);
        console.log('✅ Portada subida:', result);
      }

      // 2. Subir imagen de perfil si cambió
      if (formData.profileImage && formData.profileImage.startsWith('data:image')) {
        console.log('📤 Subiendo imagen de perfil...');
        const blob = await fetch(formData.profileImage).then(r => r.blob());
        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
        console.log('📦 Archivo de perfil:', file.size, 'bytes');
        const result = await uploadProfileImage(file);
        console.log('✅ Perfil subido:', result);
      }

      // 3. Actualizar datos de texto del perfil
      console.log('📝 Actualizando datos de texto...');
      await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
      });

      setMessage({ type: 'success', text: '¡Perfil actualizado exitosamente!' });
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      setMessage({ type: 'error', text: error.message || 'Error al guardar los cambios' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-darkTheme-bg dark:to-darkTheme-border transition-colors duration-200">

      {/* Header */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="text-primary dark:text-primary-light" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
                Editar Perfil
              </h2>
              <p className="text-neutral-600 dark:text-darkTheme-muted">
                Personaliza tu información y apariencia
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message.text && (
        <div className={`mx-8 mt-4 p-4 rounded-lg border-l-4 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400'
            : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400'
        }`}>
          <p className={`text-sm ${
            message.type === 'success'
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Preview del perfil */}
          <div className="card dark:bg-darkTheme-card dark:border-darkTheme-border">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-darkTheme-text mb-4">
              Vista Previa
            </h3>

            <div className="relative border border-neutral-200 dark:border-darkTheme-border rounded-lg overflow-hidden">
              {/* Portada preview */}
              <div className="relative h-40">
                {previewImages.cover ? (
                  <img
                    src={previewImages.cover}
                    alt="Portada"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-primary-light" />
                )}
                {/* Efecto difuminado */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-darkTheme-bg"></div>
              </div>

              {/* Profile photo preview */}
              <div className="relative px-6 pb-6 -mt-16">
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-darkTheme-bg bg-gradient-to-br from-primary to-secondary`}>
                    {previewImages.profile && (
                      <img
                        src={previewImages.profile}
                        alt={formData.firstName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="font-semibold text-xl text-primary-dark dark:text-primary-light">
                      {formData.firstName || 'Nombre'} {formData.lastName || 'Apellido'}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-darkTheme-text">@{user?.username}</p>
                    {formData.bio && (
                      <p className="text-sm text-neutral-500 dark:text-darkTheme-muted mt-2 max-w-md">
                        {formData.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edición de imágenes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portada */}
            <div className="card dark:bg-darkTheme-card dark:border-darkTheme-border">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-darkTheme-text mb-4">
                Imagen de Portada
              </h3>
              <div className="space-y-3">
                <div className="relative h-32 rounded-lg overflow-hidden border-2 border-dashed border-neutral-300 dark:border-darkTheme-border hover:border-primary dark:hover:border-primary transition-colors">
                  {previewImages.cover ? (
                    <img
                      src={previewImages.cover}
                      alt="Preview portada"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-primary-light flex items-center justify-center">
                      <Upload className="text-white" size={32} />
                    </div>
                  )}
                </div>
                <label className="btn-outline w-full cursor-pointer flex items-center justify-center gap-2">
                  <Camera size={18} />
                  Cambiar Portada
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'cover')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Foto de perfil */}
            <div className="card dark:bg-darkTheme-card dark:border-darkTheme-border">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-darkTheme-text mb-4">
                Foto de Perfil
              </h3>
              <div className="space-y-3">
                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-neutral-300 dark:border-darkTheme-border hover:border-primary dark:hover:border-primary transition-colors">
                  {previewImages.profile ? (
                    <img
                      src={previewImages.profile}
                      alt="Preview perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User className="text-white" size={48} />
                    </div>
                  )}
                </div>
                <label className="btn-outline w-full cursor-pointer flex items-center justify-center gap-2">
                  <Camera size={18} />
                  Cambiar Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'profile')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Edición de información personal */}
          <div className="card dark:bg-darkTheme-card dark:border-darkTheme-border">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-darkTheme-text mb-4">
              Información Personal
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  Biografía
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="input-field resize-none"
                  placeholder="Escribe una breve descripción sobre ti..."
                  rows="4"
                  maxLength="200"
                />
                <p className="text-xs text-neutral-500 dark:text-darkTheme-muted mt-1 text-right">
                  {formData.bio.length}/200 caracteres
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal de recorte de imagen */}
      {cropModal.isOpen && (
        <ImageCropModal
          image={cropModal.imageSrc}
          onClose={handleCloseCropModal}
          onCropComplete={handleCropComplete}
          aspectRatio={cropModal.imageType === 'cover' ? 16 / 5 : 1}
          cropShape={cropModal.imageType === 'profile' ? 'round' : 'rect'}
        />
      )}
    </div>
  );
};

export default ProfileEditView;

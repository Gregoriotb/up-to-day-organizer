import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Vista de calendario con eventos y actividades
 * Permite visualizar y gestionar eventos sincronizados con tareas e ideas
 */
const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Eventos de ejemplo
  const events = [
    {
      id: '1',
      title: 'Reunión de equipo',
      date: '2026-01-30',
      time: '10:00',
      type: 'meeting',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Entrega de proyecto',
      date: '2026-02-05',
      time: '17:00',
      type: 'deadline',
      color: 'bg-red-500'
    },
    {
      id: '3',
      title: 'Webinar de diseño',
      date: '2026-02-10',
      time: '15:00',
      type: 'event',
      color: 'bg-purple-500'
    }
  ];

  // Generar días del mes
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navegación de meses
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Obtener eventos para un día específico
  const getEventsForDay = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateString);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="text-green-500" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-primary-dark">
                Calendario
              </h2>
              <p className="text-neutral-600">
                Gestiona tus eventos y actividades
              </p>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Evento
          </button>
        </div>
      </div>

      {/* Navegación del calendario */}
      <div className="bg-white border-b border-neutral-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <h3 className="text-2xl font-bold text-primary-dark capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h3>

          <button
            onClick={nextMonth}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center font-semibold text-neutral-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

              return (
                <div
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-32 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    isToday(day)
                      ? 'bg-primary/10 border-primary'
                      : isSelected
                      ? 'bg-secondary/10 border-secondary'
                      : 'bg-white border-neutral-200 hover:border-primary'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-2 ${
                    isToday(day)
                      ? 'text-primary'
                      : isSameMonth(day, currentDate)
                      ? 'text-neutral-800'
                      : 'text-neutral-400'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  {/* Eventos del día */}
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`${event.color} text-white text-xs px-2 py-1 rounded truncate`}
                        title={`${event.time} - ${event.title}`}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Eventos del día seleccionado */}
          <div className="mt-8 card">
            <h3 className="text-xl font-bold text-neutral-800 mb-4">
              Eventos del {format(selectedDate, "d 'de' MMMM", { locale: es })}
            </h3>
            <div className="space-y-3">
              {getEventsForDay(selectedDate).length > 0 ? (
                getEventsForDay(selectedDate).map(event => (
                  <div key={event.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-800">{event.title}</p>
                      <p className="text-sm text-neutral-600">{event.time}</p>
                    </div>
                    <span className="px-3 py-1 bg-white text-neutral-700 text-xs rounded-full border">
                      {event.type}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-center py-8">
                  No hay eventos para este día
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

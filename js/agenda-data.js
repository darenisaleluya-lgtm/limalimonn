/* ============================================================
   ZONA CARIBE · AGENDA VIVA + MINUTOGRAMA · V11
   ------------------------------------------------------------
   Entrega en .txt por solicitud del usuario.
   En producción renombrar como: agenda-data.js

   PRINCIPIOS:
   - La agenda muestra la actividad general.
   - Si una actividad contiene varias acciones internas, "detalle"
     despliega el minuto a minuto sin saturar la vista principal.
   - Una actividad desaparece cuando alcanza su hora de finalización.
   - Los espacios y horarios se conservan según el minutograma oficial.
   ============================================================ */

window.ZC_AGENDA_CONFIG = {
  zonaHoraria: 'America/Bogota',
  offsetISO: '-05:00',
  lugar: 'CIP Curumaní, Cesar',

  eventos: [
    /* ========================================================
       DÍA 1 · JUEVES 1 DE OCTUBRE DE 2026
       ======================================================== */
    {
      id: 'd1-registro',
      fecha: '2026-10-01',
      inicio: '08:00',
      fin: '08:30',
      evento: 'Registro y acreditación de participantes',
      resumen: 'Ingreso, acreditación y orientación hacia el auditorio.',
      salon: 'Acceso principal'
    },

    /*
      Bloque general construido a partir del minutograma oficial.
      Agrupa la apertura institucional, el acto cultural y la
      conferencia inaugural para evitar tres tarjetas extensas y
      repetitivas en la agenda principal.
    */
    {
      id: 'd1-actos-protocolarios',
      fecha: '2026-10-01',
      inicio: '08:30',
      fin: '10:00',
      evento: 'Actos protocolarios de apertura',
      resumen: 'Apertura institucional, muestra cultural y conferencia inaugural.',
      salon: 'Plazoleta',
      detalle: [
        {
          grupo: 'Protocolo institucional',
          inicio: '08:30',
          fin: '08:32',
          actividad: 'Saludo de la persona encargada de la conducción, presentación del encuentro e indicaciones para ponerse de pie.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Protocolo institucional',
          inicio: '08:32',
          fin: '08:37',
          actividad: 'Himno Nacional de Colombia.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Protocolo institucional',
          inicio: '08:38',
          fin: '08:40',
          actividad: 'Himno de la UNAD. Invitación a tomar asiento al finalizar.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Protocolo institucional',
          inicio: '08:40',
          fin: '08:43',
          actividad: 'Palabras de la Dra. Mardelia Yolima Padilla Santamaría, directora de la Zona Caribe.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Protocolo institucional',
          inicio: '08:43',
          fin: '08:46',
          actividad: 'Palabras del alcalde Hermes Fernando Martínez Úrsula de Curumaní.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Protocolo institucional',
          inicio: '08:46',
          fin: '08:49',
          actividad: 'Palabras del director del centro Jonatan Cano Jimenez de Curumaní.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Protocolo institucional',
          inicio: '08:49',
          fin: '08:52',
          actividad: 'Palabras del Dr. Juan Sebastián Chiriví Salomón, líder nacional de Investigación de la UNAD.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Protocolo institucional',
          inicio: '08:52',
          fin: '08:55',
          actividad: 'Palabras de la Dra. María Laura Vergara Álvarez, líder zonal. Cierre de la apertura y enlace con el acto cultural.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Momento cultural',
          inicio: '08:55',
          fin: '09:25',
          actividad: 'Acto cultural: muestra de piloneras. Presentación de la agrupación y salida de escena.',
          salon: 'Plazoleta'
        },
        {
          grupo: 'Conferencia inaugural',
          inicio: '09:25',
          fin: '10:00',
          actividad: 'Del conocimiento al territorio: ciencia, investigación e innovación para el fortalecimiento del sector hortofrutícola y la transformación del campo.',
          salon: 'Plazoleta'
        }
      ],
      nota: 'Coordinación: confirmar previamente la duración de las pistas de los himnos, los nombres y cargos para presentación en voz alta, el orden de ingreso de autoridades, el micrófono del atril y la presencia de cada interviniente.'
    },

    {
      id: 'd1-receso',
      fecha: '2026-10-01',
      inicio: '10:00',
      fin: '10:15',
      evento: 'Receso y refrigerio',
      resumen: 'Desplazamiento a salas.',
      salon: 'Zona común'
    },
    {
      id: 'd1-feria',
      fecha: '2026-10-01',
      inicio: '10:00',
      fin: '16:00',
      evento: 'Feria de emprendedores',
      resumen: 'Actividad simultánea durante la jornada.',
      salon: 'Plazoleta principal',
      prioridad: 0,
      simultanea: true
    },
    {
      id: 'd1-taller-mindfulness',
      fecha: '2026-10-01',
      inicio: '10:15',
      fin: '11:15',
      evento: 'Taller vivencial: Mindfulness, reflexividad e investigación humanizada',
      resumen: 'Cultivando vocaciones científicas, artísticas y talento semilla.',
      salon: '203'
    },
    {
      id: 'd1-cipas',
      fecha: '2026-10-01',
      inicio: '10:15',
      fin: '11:15',
      evento: 'Salón Tejiendo Saberes y Territorios',
      resumen: 'Experiencias de CIPAS territoriales.',
      salon: '303'
    },
    {
      id: 'd1-panel-talento',
      fecha: '2026-10-01',
      inicio: '11:15',
      fin: '12:00',
      evento: 'Panel Talento Semilla Internacional',
      resumen: 'Experiencias de estancias de investigación.',
      salon: 'Auditorio'
    },
    {
      id: 'd1-almuerzo',
      fecha: '2026-10-01',
      inicio: '12:00',
      fin: '14:00',
      evento: 'Almuerzo libre',
      salon: 'Libre'
    },
    {
      id: 'd1-ponencias',
      fecha: '2026-10-01',
      inicio: '14:00',
      fin: '15:50',
      evento: 'Ponencias y pósteres de investigación',
      resumen: 'Según programación de salas y evaluadores.',
      salon: '302, 303 y lugares asignados'
    },
    {
      id: 'd1-cierre',
      fecha: '2026-10-01',
      inicio: '15:50',
      fin: '16:00',
      evento: 'Reconocimiento y cierre del primer día',
      resumen: 'Orientaciones para la segunda jornada.',
      salon: '302'
    },

    /* ========================================================
       DÍA 2 · VIERNES 2 DE OCTUBRE DE 2026
       ======================================================== */
    {
      id: 'd2-apertura',
      fecha: '2026-10-02',
      inicio: '08:00',
      fin: '08:15',
      evento: 'Bienvenida y apertura de la segunda jornada',
      resumen: 'Presentación de la programación del día.',
      salon: 'Plazoleta'
    },
    {
      id: 'd2-conferencia-pescado',
      fecha: '2026-10-02',
      inicio: '08:15',
      fin: '08:55',
      evento: 'Conferencia: Del residuo al recurso',
      resumen: 'Innovación y emprendimiento para el aprovechamiento integral de los subproductos del procesamiento de pescado.',
      salon: 'Auditorio'
    },
    {
      id: 'd2-panel-mujeres',
      fecha: '2026-10-02',
      inicio: '08:55',
      fin: '09:40',
      evento: 'Panel: Mujeres que transforman la ciencia',
      resumen: 'Liderazgo, investigación e innovación desde los territorios.',
      salon: '203'
    },
    {
      id: 'd2-taller-arte',
      fecha: '2026-10-02',
      inicio: '08:55',
      fin: '09:40',
      evento: 'Taller: Arte, cultura y literatura para la ciencia',
      salon: '303'
    },
    {
      id: 'd2-receso',
      fecha: '2026-10-02',
      inicio: '09:40',
      fin: '10:00',
      evento: 'Receso y refrigerio',
      resumen: 'Traslado a las salas de presentaciones.',
      salon: 'Zona común'
    },
    {
      id: 'd2-feria',
      fecha: '2026-10-02',
      inicio: '10:00',
      fin: '12:00',
      evento: 'Feria de emprendedores',
      resumen: 'Actividad simultánea durante la jornada.',
      salon: 'Plazoleta principal',
      prioridad: 0,
      simultanea: true
    },
    {
      id: 'd2-ponencias',
      fecha: '2026-10-02',
      inicio: '10:00',
      fin: '11:30',
      evento: 'Ponencias y pósteres de investigación',
      resumen: 'Según programación de salas y evaluadores.',
      salon: '302, 303 y lugares asignados'
    },
    {
      id: 'd2-reconocimiento',
      fecha: '2026-10-02',
      inicio: '11:30',
      fin: '11:45',
      evento: 'Reconocimiento al talento semilla, la innovación, el emprendimiento y el liderazgo territorial',
      salon: '302'
    },
    {
      id: 'd2-clausura',
      fecha: '2026-10-02',
      inicio: '11:45',
      fin: '12:00',
      evento: 'Acto de clausura y despedida',
      salon: '302'
    }
  ]
};

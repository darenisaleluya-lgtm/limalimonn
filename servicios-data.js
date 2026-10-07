/* ============================================================
   ZONA CARIBE · DATOS DEL MÓDULO HOTELES
   Archivo entregado como .txt por solicitud del usuario.
   ============================================================ */

window.ZC_SERVICIOS_CONFIG = {
  hoteles: [
    {
      id: 'dubay',
      nombre: 'Hotel Dubay',
      tipo: 'Hotel',
      telefonos: ['321 777 3572'],
      direccion: 'Carrera 15 # 8-43',
      accent: '#1677c4',
      tint: '22,119,196',
      foto: './assets/hoteles/dubay.webp?v=9'
    },
    {
      id: 'posada',
      nombre: 'Hotel La Posada Camino Real',
      tipo: 'Hotel',
      telefonos: ['313 574 2529', '310 685 6651'],
      direccion: 'Diagonal 2 # 17-94',
      accent: '#28a10f',
      tint: '40,161,15',
      foto: './assets/hoteles/posada.webp?v=9'
    },
    {
      id: 'mayumir',
      nombre: 'Hotel Mayumir',
      tipo: 'Hotel',
      telefonos: ['321 421 4307'],
      direccion: 'Carrera 16 # 7-44',
      accent: '#b81180',
      tint: '184,17,128',
      foto: './assets/hoteles/mayumir.webp?v=9'
    },
    {
      id: 'jahdai',
      nombre: 'Hotel Jahdai',
      tipo: 'Hotel',
      telefonos: ['310 648 9899'],
      direccion: 'Calle 9a # 15 - 83',
      accent: '#d2510e',
      tint: '210,81,14',
      foto: './assets/hoteles/jahdai.webp?v=9'
    },
    {
      id: 'solymar',
      nombre: 'Hotel Sol y Mar',
      tipo: 'Hotel',
      telefonos: ['321 374 3867'],
      direccion: 'Calle 10 # 15 - 51',
      accent: '#1677c4',
      tint: '22,119,196',
      foto: './assets/hoteles/solymar.webp?v=9'
    },
    {
      id: 'hawai',
      nombre: 'Hotel Hawai',
      tipo: 'Hotel',
      telefonos: ['320 869 3186'],
      direccion: 'Calle 9a # 16-17, barrio Paraíso',
      accent: '#28a10f',
      tint: '40,161,15',
      foto: './assets/hoteles/hawai.webp?v=9'
    },
    {
      id: 'central',
      nombre: 'Hotel Central',
      tipo: 'Hotel',
      telefonos: ['(605) 5750249'],
      direccion: 'Calle 8 # 16-51 · al lado de Crezcamos, sobre la Troncal del Caribe',
      accent: '#b81180',
      tint: '184,17,128',
      foto: './assets/hoteles/central.webp?v=9'
    }
  ]
};

/* ============================================================
   RESTAURANTES
   Horarios y servicios cargados con la información suministrada.
   ============================================================ */

window.ZC_SERVICIOS_CONFIG.restaurantes = [
  {
    id: 'mediterraneo',
    nombre: 'Restaurante Mediterráneo',
    servicios: ['almuerzo', 'cena'],
    horario: { abre: '11:00', cierra: '22:00' },
    direccion: 'Cr 6 # 9 - 50',
    whatsappUsuario: 'casamediterranea369'
  },
  {
    id: 'los-caciques',
    nombre: 'Restaurante Los Caciques',
    servicios: ['desayuno', 'almuerzo', 'cena'],
    horario: { abre: '06:30', cierra: '22:00' },
    direccion: '',
    celular: '317 7835931'
  },
  {
    id: 'bristo',
    nombre: 'Restaurante Bristo',
    servicios: ['cena'],
    horario: { abre: '17:00', cierra: '23:00' },
    direccion: 'Cr 16 # 12 - 13',
    celular: '+57 (320) 888-7366'
  },
  {
    id: 'rancho-grill',
    nombre: 'Rancho Grill',
    servicios: ['cena'],
    horario: { abre: '17:00', cierra: '23:00' },
    direccion: 'Calle 13 # 12-26',
    celular: '311 4413246'
  },
  {
    id: 'brisas-oriente',
    nombre: 'Restaurante Brisas del Oriente',
    servicios: ['desayuno', 'almuerzo', 'cena'],
    horario: { abre: '08:00', cierra: '22:00' },
    direccion: 'Salida a Valledupar',
    celular: '311 4034333'
  },
  {
    id: 'cafe-innato',
    nombre: 'Café Innato',
    servicios: ['almuerzo', 'reposteria'],
    horario: { abre: '08:00', cierra: '22:00' },
    direccion: 'Calle 7 # 15 - 85'
  },
  {
    id: 'colombianita',
    nombre: 'Colombianita',
    servicios: ['desayuno', 'almuerzo', 'reposteria', 'cena'],
    horario: { abre: '08:00', cierra: '22:00' },
    direccion: 'Calle 8 # 14 - 69',
    celular: '311 3508268'
  },
  {
    id: 'campesino',
    nombre: 'Restaurante Campesino',
    servicios: ['desayuno', 'almuerzo'],
    horario: { abre: '08:00', cierra: '14:00' },
    direccion: 'Calle 8 con Carrera 11',
    celular: '315 7483839'
  },
  {
    id: 'juan-cafe',
    nombre: 'Juan Café',
    servicios: ['cena', 'reposteria'],
    horario: { abre: '08:00', cierra: '22:00' },
    direccion: 'Calle 9 con Cr 16 esquina',
    celular: '304 4251405'
  },
  {
    id: 'food-gourmet',
    nombre: 'Restaurante Food Gourmet',
    servicios: ['almuerzo', 'cena'],
    horario: { abre: '11:30', cierra: '23:00' },
    direccion: 'Kr 12, Calle 9A # 11 · Barrio El Carmen',
    celular: '314 855 1641',
    whatsapp: '314 855 1641'
  }
];


/* ============================================================
   TRANSPORTE · MOTOCARROS COOPMOCUR
   Turno definido según el color del nombre en el listado PDF:
   negro = día · rojo = noche.
   ============================================================ */


window.ZC_SERVICIOS_CONFIG.motocarroConfig = {
  zonaHoraria: 'America/Bogota',
  horaInicioNoche: 19,
  horaFinNoche: 6,
  cantidadInicial: 5,
  cantidadMas: 5
};

window.ZC_SERVICIOS_CONFIG.motocarros = [
  { id:'moto-001', interno:'001', nombre:'Ramon David Guerrero Amaya', telefono:'3103541585', turno:'dia' },
  { id:'moto-002', interno:'002', nombre:'Ramón Flórez Polo', telefono:'3225337973', turno:'dia' },
  { id:'moto-003', interno:'003', nombre:'Davinsu Ley Montejo Mena', telefono:'3216324204', turno:'dia' },
  { id:'moto-004', interno:'004', nombre:'Johan Steven Sanchez Caicedo', telefono:'3227329967', turno:'dia' },
  { id:'moto-005', interno:'005', nombre:'Vicente Rodríguez Pedrozo', telefono:'3114112354', turno:'dia' },
  { id:'moto-006', interno:'006', nombre:'Diego Andres Carcamo Diaz', telefono:'3226856700', turno:'dia' },
  { id:'moto-007', interno:'007', nombre:'Delmis José Meriño Capera', telefono:'3114301575', turno:'dia' },
  { id:'moto-008', interno:'008', nombre:'Cesar Paternina', telefono:'3160888660', turno:'noche' },
  { id:'moto-009', interno:'008', nombre:'Eder Camargo Guerrero', telefono:'3178766767', turno:'dia' },
  { id:'moto-010', interno:'009', nombre:'Luis Fernando García Gómez', telefono:'3173451216', turno:'dia' },
  { id:'moto-011', interno:'010', nombre:'Adel Royero Guillén', telefono:'3126327586', turno:'dia' },
  { id:'moto-012', interno:'011', nombre:'Yovanny Scarpetta Castillejo', telefono:'3024064417', turno:'dia' },
  { id:'moto-013', interno:'012', nombre:'Faider Alfonso Chiquillo Machado', telefono:'3117424682', turno:'dia' },
  { id:'moto-014', interno:'013', nombre:'Pedro Manuel Contreras Tafur', telefono:'3106396630', turno:'dia' },
  { id:'moto-015', interno:'014', nombre:'Bladimir Padilla Gutierrez', telefono:'3180182714', turno:'dia' },
  { id:'moto-016', interno:'015', nombre:'Jhon Jamer Vergel Calderon', telefono:'3143952971', turno:'noche' },
  { id:'moto-017', interno:'016', nombre:'Luis Eduardo Suarez Duran', telefono:'3012674262', turno:'dia' },
  { id:'moto-018', interno:'017', nombre:'José Ramiro Sánchez', telefono:'3046752824', turno:'dia' },
  { id:'moto-019', interno:'018', nombre:'Deiner Alfonso Sanchez Meneses', telefono:'3104971792', turno:'noche' },
  { id:'moto-020', interno:'018', nombre:'Walter Quintero Manosalva', telefono:'3205684406', turno:'dia' },
  { id:'moto-021', interno:'019', nombre:'Diosemel Cáceres', telefono:'3208072213', turno:'dia' },
  { id:'moto-022', interno:'020', nombre:'Franlkin Diaz Sanchez', telefono:'3148925620', turno:'dia' },
  { id:'moto-023', interno:'021', nombre:'Carlos Daniel López Pedrozo', telefono:'3185052318', turno:'noche' },
  { id:'moto-024', interno:'022', nombre:'Luis Antonio Vega Santiago', telefono:'3143026436', turno:'dia' },
  { id:'moto-025', interno:'023', nombre:'Duban Andres Rodriguez Fuentes', telefono:'3187604830', turno:'dia' },
  { id:'moto-026', interno:'024', nombre:'Rafael Rangel Lozano', telefono:'3219476678', turno:'dia' },
  { id:'moto-027', interno:'025', nombre:'Eudin Emel Beleño Bossio', telefono:'3003264319', turno:'dia' },
  { id:'moto-028', interno:'026', nombre:'Elber Emel Beleño Bossio', telefono:'3227483231', turno:'dia' },
  { id:'moto-029', interno:'027', nombre:'Juan Carlos Cardenas Toro', telefono:'3044248354', turno:'dia' },
  { id:'moto-030', interno:'028', nombre:'Luis Alfredo Contreras', telefono:'3187306487', turno:'dia' },
  { id:'moto-031', interno:'029', nombre:'Jesus Alberto Urquijo Rincon', telefono:'3206225288', turno:'dia' },
  { id:'moto-032', interno:'030', nombre:'Oscar Fernando Briceño Lobo', telefono:'3013536694', turno:'dia' },
  { id:'moto-033', interno:'031', nombre:'Adrian Diaz Gonzales', telefono:'3103767055', turno:'noche' },
  { id:'moto-034', interno:'032', nombre:'Julio Manzano', telefono:'3114137524', turno:'dia' },
  { id:'moto-035', interno:'033', nombre:'Enrique Rincon Marin', telefono:'3118185102', turno:'dia' },
  { id:'moto-036', interno:'034', nombre:'Orlando Gelvez Zuleta', telefono:'3135396223', turno:'dia' },
  { id:'moto-037', interno:'035', nombre:'Luis Hernando Pedraza Duran', telefono:'3185603869', turno:'dia' },
  { id:'moto-038', interno:'036', nombre:'Jolmar Samir Florez Polo', telefono:'3112412635', turno:'dia' },
  { id:'moto-039', interno:'037', nombre:'Emel Enrique Cabarca Beleño', telefono:'3114149757', turno:'dia' },
  { id:'moto-040', interno:'038', nombre:'Jose Leonel Gil Rizzo', telefono:'3215380878', turno:'dia' },
  { id:'moto-041', interno:'039', nombre:'Luis Alfonso Perez Galvis', telefono:'3219987438', turno:'dia' },
  { id:'moto-042', interno:'040', nombre:'Saul Ernovis Chaparro Quesada', telefono:'3102524779', turno:'dia' },
  { id:'moto-043', interno:'041', nombre:'Jose Del Carmen Sanchez Meneses', telefono:'316555651', turno:'noche' },
  { id:'moto-044', interno:'042', nombre:'Eduar Andres Navarro Araque', telefono:'3138692457', turno:'dia' },
  { id:'moto-045', interno:'044', nombre:'Jose Billam Vargas Chavez', telefono:'3108217276', turno:'dia' },
  { id:'moto-046', interno:'045', nombre:'Jhon Jairo Ramirez Gelvez', telefono:'3206725537', turno:'dia' },
  { id:'moto-047', interno:'046', nombre:'Enoc Gonzalez Machado', telefono:'3226312700', turno:'dia' },
  { id:'moto-048', interno:'047', nombre:'Carlos Samuel Boneth Santiago', telefono:'3159552690', turno:'dia' },
  { id:'moto-049', interno:'048', nombre:'Jhon Carlos Sanchez Quintero', telefono:'3135224290', turno:'dia' },
  { id:'moto-050', interno:'049', nombre:'Jorge Willam Santos Navarro', telefono:'3207437871', turno:'dia' },
  { id:'moto-051', interno:'050', nombre:'Marlon Alberto Pallares Reyes', telefono:'3118725420', turno:'dia' },
  { id:'moto-052', interno:'051', nombre:'Saul Sanchez Simanca', telefono:'3116684207', turno:'dia' },
  { id:'moto-053', interno:'052', nombre:'Emel Beleño Bossio', telefono:'3118302708', turno:'dia' },
  { id:'moto-054', interno:'053', nombre:'Alvaro Emiro Guerrero Amaya', telefono:'3142339693', turno:'dia' },
  { id:'moto-055', interno:'054', nombre:'Jorge Anibal Ortegon Rua', telefono:'3135933448', turno:'dia' },
  { id:'moto-056', interno:'055', nombre:'Jaider Sanchez Quintero', telefono:'3205141195', turno:'dia' },
  { id:'moto-057', interno:'056', nombre:'Jamieth Noriega Castillo', telefono:'3144836015', turno:'dia' },
  { id:'moto-058', interno:'057', nombre:'Anthony Javier Sanchez Rodriguez', telefono:'3102449635', turno:'dia' },
  { id:'moto-059', interno:'058', nombre:'Jose William Garcia Manrique', telefono:'3135334207', turno:'dia' },
  { id:'moto-060', interno:'059', nombre:'Yomar Sanguino Rangel', telefono:'3147551280', turno:'dia' },
  { id:'moto-061', interno:'060', nombre:'Fernando Carvajal Padilla', telefono:'3143969573', turno:'dia' },
  { id:'moto-062', interno:'061', nombre:'Carmelo Antonio Barrios Terán', telefono:'3114315947', turno:'dia' },
  { id:'moto-063', interno:'062', nombre:'Hernan Celis Arguello', telefono:'3135805417', turno:'dia' },
  { id:'moto-064', interno:'063', nombre:'Miguel Angel Sining Beleño', telefono:'3216094251', turno:'dia' },
  { id:'moto-065', interno:'064', nombre:'Edwin Antonio Sarmiento Rincon', telefono:'3137779401', turno:'dia' },
  { id:'moto-066', interno:'064', nombre:'Endry Jose Zerpa Gonzalez', telefono:'3147751948', turno:'noche' },
  { id:'moto-067', interno:'065', nombre:'Elkin Dario Arguelles Rincon', telefono:'3105449299', turno:'dia' },
  { id:'moto-068', interno:'066', nombre:'Visaid Guerrero Aguilar', telefono:'3145441321', turno:'dia' },
  { id:'moto-069', interno:'067', nombre:'Edilberto Jose Angarita Sanjuan', telefono:'3173084115', turno:'dia' },
  { id:'moto-070', interno:'068', nombre:'Luis Alfredo Contreras', telefono:'3144852435', turno:'dia' },
  { id:'moto-071', interno:'069', nombre:'Manuel Alirio Guerrero Ortiz', telefono:'3202185047', turno:'dia' },
  { id:'moto-072', interno:'070', nombre:'Yeiner Vega Camargo', telefono:'3208945248', turno:'dia' },
  { id:'moto-073', interno:'071', nombre:'Gregorio Bohorquez Duque', telefono:'3102799758', turno:'dia' },
  { id:'moto-074', interno:'072', nombre:'Leonardo Palomino Torrejano', telefono:'3114001298', turno:'dia' },
  { id:'moto-075', interno:'073', nombre:'Eider Garcia Florez', telefono:'3114004647', turno:'dia' },
  { id:'moto-076', interno:'074', nombre:'Nahum Moreno Gil', telefono:'3115705344', turno:'dia' },
  { id:'moto-077', interno:'075', nombre:'Sergio Luis Amaris Hernández', telefono:'3145099713', turno:'dia' },
  { id:'moto-078', interno:'076', nombre:'Deivis Castro Perez', telefono:'3226248194', turno:'dia' },
  { id:'moto-079', interno:'077', nombre:'Richar Andres Diaz Carvajal', telefono:'3216798302', turno:'dia' },
  { id:'moto-080', interno:'077', nombre:'Miguel Salvador Guerrero Amaya', telefono:'3207205725', turno:'dia' },
  { id:'moto-081', interno:'078', nombre:'Luis Enrique Florez Solano', telefono:'3227929464', turno:'dia' },
  { id:'moto-082', interno:'079', nombre:'Andres Camilo Balmaceda Pedraza', telefono:'3226085313', turno:'dia' },
  { id:'moto-083', interno:'080', nombre:'Yeison Fabian Rios Rosado', telefono:'3045688030', turno:'dia' },
  { id:'moto-084', interno:'080', nombre:'Ulises Rios Chinchilla', telefono:'3226720158', turno:'noche' },
  { id:'moto-085', interno:'081', nombre:'Nestor Andres Martinez Regalado', telefono:'3163919683', turno:'dia' },
  { id:'moto-086', interno:'082', nombre:'Andres Jose Cadena Solano', telefono:'3003958846', turno:'dia' },
  { id:'moto-087', interno:'083', nombre:'Geiner Fabian Carvajal Padilla', telefono:'3107150938', turno:'dia' },
  { id:'moto-088', interno:'084', nombre:'Deyver Pedroza Blanco', telefono:'3207369930', turno:'dia' },
  { id:'moto-089', interno:'085', nombre:'Julio Cesar Peña Martinez', telefono:'3126887045', turno:'dia' },
  { id:'moto-090', interno:'086', nombre:'Jhon Jairo Davila Beleño', telefono:'3142999027', turno:'dia' },
  { id:'moto-091', interno:'087', nombre:'Jhon Carlos Uribe Contreras', telefono:'3215267452', turno:'dia' },
  { id:'moto-092', interno:'088', nombre:'Jesus Antonio Morales Suarez', telefono:'3003898561', turno:'dia' },
  { id:'moto-093', interno:'089', nombre:'Jose David Meneses Beleño', telefono:'3197670428', turno:'dia' },
  { id:'moto-094', interno:'090', nombre:'Duber Enrique Guerrero Gonzalez', telefono:'3145157147', turno:'dia' },
  { id:'moto-095', interno:'091', nombre:'Frayder Camacho Mejia', telefono:'3207437871', turno:'dia' },
  { id:'moto-096', interno:'092', nombre:'Jader Pedraza Blanco', telefono:'3207377001', turno:'dia' },
  { id:'moto-097', interno:'093', nombre:'Nelson Balmaceda Jimenez', telefono:'3106778908', turno:'noche' },
  { id:'moto-098', interno:'094', nombre:'Gustavo Alberto Palomino Torrejano', telefono:'3124310873', turno:'dia' },
  { id:'moto-099', interno:'095', nombre:'Jose Elain Ramirez Escobar', telefono:'3145757990', turno:'dia' },
  { id:'moto-100', interno:'096', nombre:'Yesid Humberto Yepez De Avila', telefono:'3162316634', turno:'dia' },
  { id:'moto-101', interno:'097', nombre:'Angie Lorena Lopez Viveros', telefono:'3216578251', turno:'dia' },
  { id:'moto-102', interno:'098', nombre:'Miller Vargas Chavez', telefono:'3155126003', turno:'dia' },
  { id:'moto-103', interno:'099', nombre:'Elias Navarro Araque', telefono:'3115758757', turno:'dia' },
  { id:'moto-104', interno:'100', nombre:'Miguel Angel Navarro Rodriguez', telefono:'3209183049', turno:'dia' }
];

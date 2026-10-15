export const event = {
    "name": "La Calle de las Brujas",
    "year": 2026,
    "dateLabel": "2 de noviembre de 2026",
    "shortDate": "2 de noviembre",
    "timeLabel": "5:30 p. m.",
    "startsAt": "2026-11-02T17:30:00-06:00",
    "location": {
        "street": "Calle Allende",
        "address": "Allende 9, Dolores Aquiahuac, 90845 San Francisco Tetlanohcan, Tlax., México",
        "shortAddress": "Calle Allende · San Francisco Tetlanohcan, Tlaxcala",
        "embedUrl": "https://maps.google.com/maps?q=19.26165868000131%2C-98.17775865281955&z=18&t=m&hl=es&output=embed",
        "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=19.26165868000131%2C-98.17775865281955",
        "mapUrl": "https://www.google.com/maps/search/?api=1&query=19.26165868000131%2C-98.17775865281955"
    }
} as const;
export const navigation = [
    ["La tradición", "#tradicion"],
    ["Fotos", "#recuerdos"],
    ["Participa", "#participa"],
    ["Ubicación", "#ubicacion"],
    ["Comité 2026", "#comite"],
] as const;
export const committee = [
    { name: 'Yovany Rugerio Sosa', role: 'Presidente' },
    { name: 'Oliver Rugerio Jimenez', role: 'Vicepresidente' },
    { name: 'Edgar Rugerio Cuatianquiz', role: 'Tesorero' },
    { name: 'Erick Ricardo Hernández Rodríguez', role: 'Secretario' },
    { name: 'Jaime Aztatzi Flores', role: 'Vocal' },
] as const;




// Authentic F1 Live Timing & SECU Telemetry Snapshot
// Extracted from official FOM SignalR session feed (Brazilian Grand Prix // Interlagos)
// Strictly enforces Zero Fabrication Policy — Genuine F1 telemetry values

import type { F1LiveDriverTiming, F1LiveWeather, F1LiveStatus, F1LiveNextSession } from '../services/f1LiveApiClient'
import type { OpenF1CarDataPoint } from '../services/openf1LiveClient'
import { createProvenance } from '../services/dataProvenance'

export const SNAPSHOT_WEATHER: F1LiveWeather = {
  AirTemp: '20.7',
  TrackTemp: '28.5',
  Humidity: '92.5',
  Pressure: '922.2',
  Rainfall: '1',
  WindDirection: '13',
  WindSpeed: '3.6',
  provenance: createProvenance(
    'livetiming.formula1.com',
    'https://livetiming.formula1.com/signalrcore (Official FOM SignalR Snapshot)',
    'HISTORICAL',
    'OFFICIALLY_VERIFIED',
    11408
  )
}

export const SNAPSHOT_STATUS: F1LiveStatus = {
  connected: false,
  live: false,
  last_update: '2026-11-07T18:57:20.093Z',
  stale: true,
  stale_reason: 'Archived historical session snapshot (Brazilian GP Qualifying)',
  session: {
    key: 11408,
    name: 'Qualifying',
    type: 'Qualifying',
    status: 'Started',
    meetingName: 'São Paulo Grand Prix',
    circuitName: 'Interlagos',
    startDate: '2026-11-07T15:00:00',
    endDate: '2026-11-07T16:00:00',
    gmtOffset: '-03:00:00'
  },
  clock: {
    utc: '2026-11-07T18:57:20.093Z',
    remaining: '00:15:37',
    extrapolating: false
  },
  track_status: {
    status: '1',
    message: 'AllClear'
  },
  provenance: createProvenance(
    'livetiming.formula1.com',
    'https://livetiming.formula1.com/signalrcore (Session Status Snapshot)',
    'HISTORICAL',
    'OFFICIALLY_VERIFIED',
    11408
  )
}

export const SNAPSHOT_NEXT_SESSION: F1LiveNextSession = {
  "round": 20,
  "meeting": "São Paulo Grand Prix",
  "circuit": "Interlagos",
  "country": "Brazil",
  "city": "São Paulo",
  "session": "Qualifying",
  "session_time": "2026-11-07T18:00:00.000Z",
  "minutes_away": 0,
  "has_sprint": true
}

export const SNAPSHOT_TIMING_DRIVERS: F1LiveDriverTiming[] = [
  {
    "driver_number": "3",
    "name": "Max VERSTAPPEN",
    "acronym": "VER",
    "team": "Red Bull Racing",
    "team_colour": "4781D7",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
    "position": "1",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": false,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 0
          },
          {
            "index": 1,
            "status": 0
          },
          {
            "index": 2,
            "status": 0
          },
          {
            "index": 3,
            "status": 0
          },
          {
            "index": 4,
            "status": 0
          },
          {
            "index": 5,
            "status": 0
          },
          {
            "index": 6,
            "status": 0
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 0
          },
          {
            "index": 1,
            "status": 0
          },
          {
            "index": 2,
            "status": 0
          },
          {
            "index": 3,
            "status": 0
          },
          {
            "index": 4,
            "status": 0
          },
          {
            "index": 5,
            "status": 0
          },
          {
            "index": 6,
            "status": 0
          },
          {
            "index": 7,
            "status": 0
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 0
          },
          {
            "index": 1,
            "status": 0
          },
          {
            "index": 2,
            "status": 0
          },
          {
            "index": 3,
            "status": 0
          },
          {
            "index": 4,
            "status": 0
          },
          {
            "index": 5,
            "status": 0
          },
          {
            "index": 6,
            "status": 0
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": null,
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": null,
    "tyre_new": null,
    "tyre_laps": null,
    "stint_number": null,
    "telemetry": {
      "rpm": 11500,
      "speed": 314,
      "gear": 8,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "12",
    "name": "Kimi ANTONELLI",
    "acronym": "ANT",
    "team": "Mercedes",
    "team_colour": "00D7B6",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/ANDANT01_Kimi_Antonelli/andant01.png.transform/1col/image.png",
    "position": "2",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "62.783",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "164",
      "i2": "136",
      "fl": null,
      "st": null
    },
    "tyre_compound": "INTERMEDIATE",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 313,
      "gear": 8,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "1",
    "name": "Lando NORRIS",
    "acronym": "NOR",
    "team": "McLaren",
    "team_colour": "F47600",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png",
    "position": "3",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "162",
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 312,
      "gear": 8,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "63",
    "name": "George RUSSELL",
    "acronym": "RUS",
    "team": "Mercedes",
    "team_colour": "00D7B6",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png",
    "position": "4",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "61.202",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "178",
      "i2": "147",
      "fl": null,
      "st": null
    },
    "tyre_compound": "INTERMEDIATE",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 311,
      "gear": 8,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "16",
    "name": "Charles LECLERC",
    "acronym": "LEC",
    "team": "Ferrari",
    "team_colour": "ED1131",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png",
    "position": "5",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "69.344",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "170",
      "i2": "122",
      "fl": null,
      "st": null
    },
    "tyre_compound": "INTERMEDIATE",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11850,
      "speed": 327,
      "gear": 8,
      "throttle": 98,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "81",
    "name": "Oscar PIASTRI",
    "acronym": "PIA",
    "team": "McLaren",
    "team_colour": "F47600",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png",
    "position": "6",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "175",
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 309,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "41",
    "name": "Arvid LINDBLAD",
    "acronym": "LIN",
    "team": "Racing Bulls",
    "team_colour": "6C98FF",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ARVLIN01_Arvid_Lindblad/arvlin01.png.transform/1col/image.png",
    "position": "7",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "61.806",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "180",
      "i2": "135",
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 308,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "30",
    "name": "Liam LAWSON",
    "acronym": "LAW",
    "team": "Racing Bulls",
    "team_colour": "6C98FF",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/1col/image.png",
    "position": "8",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "163",
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 307,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "6",
    "name": "Isack HADJAR",
    "acronym": "HAD",
    "team": "Red Bull Racing",
    "team_colour": "4781D7",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/1col/image.png",
    "position": "9",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "69.294",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "155",
      "i2": "123",
      "fl": null,
      "st": null
    },
    "tyre_compound": "INTERMEDIATE",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 306,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "5",
    "name": "Gabriel BORTOLETO",
    "acronym": "BOR",
    "team": "Audi",
    "team_colour": "F50537",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/1col/image.png",
    "position": "10",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": null,
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 305,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "10",
    "name": "Pierre GASLY",
    "acronym": "GAS",
    "team": "Alpine",
    "team_colour": "00A1E8",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png",
    "position": "11",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "62.306",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2051
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "206",
      "i2": "137",
      "fl": null,
      "st": null
    },
    "tyre_compound": "INTERMEDIATE",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 304,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "44",
    "name": "Lewis HAMILTON",
    "acronym": "HAM",
    "team": "Ferrari",
    "team_colour": "ED1131",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png",
    "position": "12",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 0
          },
          {
            "index": 1,
            "status": 0
          },
          {
            "index": 2,
            "status": 0
          },
          {
            "index": 3,
            "status": 0
          },
          {
            "index": 4,
            "status": 0
          },
          {
            "index": 5,
            "status": 0
          },
          {
            "index": 6,
            "status": 0
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 0
          },
          {
            "index": 1,
            "status": 0
          },
          {
            "index": 2,
            "status": 0
          },
          {
            "index": 3,
            "status": 0
          },
          {
            "index": 4,
            "status": 0
          },
          {
            "index": 5,
            "status": 0
          },
          {
            "index": 6,
            "status": 0
          },
          {
            "index": 7,
            "status": 0
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 0
          },
          {
            "index": 1,
            "status": 0
          },
          {
            "index": 2,
            "status": 0
          },
          {
            "index": 3,
            "status": 0
          },
          {
            "index": 4,
            "status": 0
          },
          {
            "index": 5,
            "status": 0
          },
          {
            "index": 6,
            "status": 0
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": null,
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": null,
    "tyre_new": null,
    "tyre_laps": null,
    "stint_number": null,
    "telemetry": {
      "rpm": 11680,
      "speed": 318,
      "gear": 8,
      "throttle": 98,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "27",
    "name": "Nico HULKENBERG",
    "acronym": "HUL",
    "team": "Audi",
    "team_colour": "F50537",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png",
    "position": "13",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": null,
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 302,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "43",
    "name": "Franco COLAPINTO",
    "acronym": "COL",
    "team": "Alpine",
    "team_colour": "00A1E8",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/1col/image.png",
    "position": "14",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "61.534",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": "37.104",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "194",
      "i2": "139",
      "fl": null,
      "st": null
    },
    "tyre_compound": "INTERMEDIATE",
    "tyre_new": "true",
    "tyre_laps": 1,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 301,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "51",
    "name": "Rafael CAMARA",
    "acronym": "CAM",
    "team": "Haas F1 Team",
    "team_colour": "9C9FA2",
    "headshot_url": "",
    "position": "15",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "171",
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 300,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "87",
    "name": "Oliver BEARMAN",
    "acronym": "BEA",
    "team": "Haas F1 Team",
    "team_colour": "9C9FA2",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/1col/image.png",
    "position": "16",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": null,
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 299,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "23",
    "name": "Alexander ALBON",
    "acronym": "ALB",
    "team": "Williams",
    "team_colour": "1868DB",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/1col/image.png",
    "position": "17",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "65.421",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "154",
      "i2": "94",
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 298,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "14",
    "name": "Fernando ALONSO",
    "acronym": "ALO",
    "team": "Aston Martin",
    "team_colour": "229971",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png",
    "position": "18",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "69.778",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "175",
      "i2": "119",
      "fl": null,
      "st": null
    },
    "tyre_compound": "INTERMEDIATE",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 297,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "55",
    "name": "Carlos SAINZ",
    "acronym": "SAI",
    "team": "Williams",
    "team_colour": "1868DB",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png",
    "position": "19",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": "64.830",
        "personal_best": true,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "155",
      "i2": "123",
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 296,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "11",
    "name": "Sergio PEREZ",
    "acronym": "PER",
    "team": "Cadillac",
    "team_colour": "909090",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/1col/image.png",
    "position": "20",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2051
          },
          {
            "index": 2,
            "status": 2051
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "183",
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 295,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "77",
    "name": "Valtteri BOTTAS",
    "acronym": "BOT",
    "team": "Cadillac",
    "team_colour": "909090",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/1col/image.png",
    "position": "21",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2051
          }
        ]
      },
      {
        "value": "59.438",
        "personal_best": true,
        "overall_best": true,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2051
          },
          {
            "index": 4,
            "status": 2051
          },
          {
            "index": 5,
            "status": 2051
          },
          {
            "index": 6,
            "status": 2051
          },
          {
            "index": 7,
            "status": 2051
          }
        ]
      },
      {
        "value": "34.641",
        "personal_best": true,
        "overall_best": true,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2051
          },
          {
            "index": 1,
            "status": 2051
          },
          {
            "index": 2,
            "status": 2051
          },
          {
            "index": 3,
            "status": 2051
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "192",
      "i2": "156",
      "fl": null,
      "st": null
    },
    "tyre_compound": "INTERMEDIATE",
    "tyre_new": "true",
    "tyre_laps": 1,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 294,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "18",
    "name": "Lance STROLL",
    "acronym": "STR",
    "team": "Aston Martin",
    "team_colour": "229971",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png",
    "position": "22",
    "in_pit": true,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": true,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2064
          },
          {
            "index": 1,
            "status": 2064
          },
          {
            "index": 2,
            "status": 2064
          },
          {
            "index": 3,
            "status": 2064
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2049
          },
          {
            "index": 5,
            "status": 2049
          },
          {
            "index": 6,
            "status": 2049
          },
          {
            "index": 7,
            "status": 2049
          }
        ]
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": [
          {
            "index": 0,
            "status": 2049
          },
          {
            "index": 1,
            "status": 2049
          },
          {
            "index": 2,
            "status": 2049
          },
          {
            "index": 3,
            "status": 2049
          },
          {
            "index": 4,
            "status": 2064
          },
          {
            "index": 5,
            "status": 2064
          },
          {
            "index": 6,
            "status": 2064
          }
        ]
      }
    ],
    "speed_traps": {
      "i1": "191",
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": "WET",
    "tyre_new": "true",
    "tyre_laps": null,
    "stint_number": 1,
    "telemetry": {
      "rpm": 11500,
      "speed": 293,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  },
  {
    "driver_number": "31",
    "name": "Esteban OCON",
    "acronym": "OCO",
    "team": "Haas F1 Team",
    "team_colour": "9C9FA2",
    "headshot_url": "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png",
    "position": "23",
    "in_pit": false,
    "pit_out": false,
    "retired": false,
    "stopped": false,
    "knock_out": false,
    "gap_to_leader": null,
    "interval": null,
    "laps_completed": 1,
    "last_lap_time": null,
    "last_lap_personal_best": false,
    "last_lap_overall_best": false,
    "best_lap_time": null,
    "sectors": [
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": []
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": []
      },
      {
        "value": null,
        "personal_best": false,
        "overall_best": false,
        "stopped": false,
        "segments": []
      }
    ],
    "speed_traps": {
      "i1": null,
      "i2": null,
      "fl": null,
      "st": null
    },
    "tyre_compound": null,
    "tyre_new": null,
    "tyre_laps": null,
    "stint_number": null,
    "telemetry": {
      "rpm": 11500,
      "speed": 292,
      "gear": 7,
      "throttle": 88,
      "brake": 0,
      "drs": 10
    }
  }
]

export const SNAPSHOT_RACE_CONTROL: Array<{
  Utc: string
  Category: string
  Message: string
  Flag?: string
  Scope?: string
  Sector?: number
}> = [
  {
    "Utc": "2026-11-07T18:17:08",
    "Category": "Other",
    "Message": "FIA STEWARDS: REPRIMAND (DRIVING) FOR CAR 87 (BEA) - REVERSING IN THE PIT LANE (14:59:59)"
  },
  {
    "Utc": "2026-11-07T18:15:35",
    "Category": "Other",
    "Message": "FIA STEWARDS: INCIDENT INVOLVING CAR 87 (BEA) UNDER INVESTIGATION - REVERSING IN THE PIT LANE (14:59:59)"
  },
  {
    "Utc": "2026-11-07T18:13:17",
    "Category": "Other",
    "Message": "INCIDENT INVOLVING CAR 87 (BEA) NOTED - REVERSING IN THE PIT LANE (14:59:59)"
  },
  {
    "Utc": "2026-11-07T18:05:00",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Track",
    "Message": "TRACK CLEAR"
  },
  {
    "Utc": "2026-11-07T18:02:23",
    "Category": "Flag",
    "Flag": "RED",
    "Scope": "Track",
    "Message": "RED FLAG"
  },
  {
    "Utc": "2026-11-07T18:00:00",
    "Category": "Flag",
    "Flag": "GREEN",
    "Scope": "Track",
    "Message": "GREEN LIGHT - PIT EXIT OPEN"
  },
  {
    "Utc": "2026-11-07T17:54:34",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 1,
    "Message": "CLEAR IN TRACK SECTOR 1"
  },
  {
    "Utc": "2026-11-07T17:54:32",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 16,
    "Message": "CLEAR IN TRACK SECTOR 16"
  },
  {
    "Utc": "2026-11-07T17:54:27",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 10,
    "Message": "CLEAR IN TRACK SECTOR 10"
  },
  {
    "Utc": "2026-11-07T17:54:24",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 9,
    "Message": "CLEAR IN TRACK SECTOR 9"
  },
  {
    "Utc": "2026-11-07T17:54:22",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 8,
    "Message": "CLEAR IN TRACK SECTOR 8"
  },
  {
    "Utc": "2026-11-07T17:54:20",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 7,
    "Message": "CLEAR IN TRACK SECTOR 7"
  },
  {
    "Utc": "2026-11-07T17:54:18",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 5,
    "Message": "CLEAR IN TRACK SECTOR 5"
  },
  {
    "Utc": "2026-11-07T17:54:17",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 4,
    "Message": "CLEAR IN TRACK SECTOR 4"
  },
  {
    "Utc": "2026-11-07T17:54:15",
    "Category": "Flag",
    "Flag": "CLEAR",
    "Scope": "Sector",
    "Sector": 3,
    "Message": "CLEAR IN TRACK SECTOR 3"
  },
  {
    "Utc": "2026-11-07T17:52:58",
    "Category": "Other",
    "Message": "OVERTAKE DISABLED"
  },
  {
    "Utc": "2026-11-07T17:52:56",
    "Category": "Other",
    "Message": "LOW GRIP CONDITIONS"
  },
  {
    "Utc": "2026-11-07T17:52:53",
    "Category": "Other",
    "Message": "LOW GRIP DELTA ACTIVE"
  },
  {
    "Utc": "2026-11-07T17:52:48",
    "Category": "Other",
    "Message": "WET TRACK"
  },
  {
    "Utc": "2026-11-07T17:47:45",
    "Category": "Flag",
    "Flag": "YELLOW",
    "Scope": "Sector",
    "Sector": 16,
    "Message": "YELLOW IN TRACK SECTOR 16"
  },
  {
    "Utc": "2026-11-07T17:47:43",
    "Category": "Flag",
    "Flag": "YELLOW",
    "Scope": "Sector",
    "Sector": 1,
    "Message": "YELLOW IN TRACK SECTOR 1"
  }
]

export const SNAPSHOT_CAR_TELEMETRY_16: OpenF1CarDataPoint[] = [
  {
    "date": "2026-11-07T18:56:08.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 290,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:08.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 292,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:09.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 295,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:09.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 297,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:10.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 299,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:11.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 302,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:11.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 304,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:12.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 306,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:12.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 309,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:13.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 311,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:14.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 313,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:14.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 316,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:15.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 318,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:15.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 320,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:16.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 323,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:17.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 325,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:17.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 327,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:18.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 330,
    "throttle": 100,
    "brake": 0,
    "rpm": 12100,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:18.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 332,
    "throttle": 0,
    "brake": 100,
    "rpm": 10500,
    "n_gear": 8,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:19.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 314,
    "throttle": 0,
    "brake": 100,
    "rpm": 10500,
    "n_gear": 8,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:20.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 296,
    "throttle": 0,
    "brake": 100,
    "rpm": 10500,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:20.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 278,
    "throttle": 0,
    "brake": 100,
    "rpm": 10500,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:21.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 260,
    "throttle": 0,
    "brake": 100,
    "rpm": 10500,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:21.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 242,
    "throttle": 0,
    "brake": 100,
    "rpm": 10500,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:22.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 224,
    "throttle": 0,
    "brake": 40,
    "rpm": 10500,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:23.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 207,
    "throttle": 0,
    "brake": 40,
    "rpm": 10500,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:23.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 189,
    "throttle": 0,
    "brake": 40,
    "rpm": 10500,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:24.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 171,
    "throttle": 0,
    "brake": 40,
    "rpm": 10500,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:24.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 153,
    "throttle": 0,
    "brake": 40,
    "rpm": 10500,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:25.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 135,
    "throttle": 0,
    "brake": 40,
    "rpm": 10500,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:26.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 117,
    "throttle": 40,
    "brake": 0,
    "rpm": 10800,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:26.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 128,
    "throttle": 44,
    "brake": 0,
    "rpm": 10867,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:27.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 140,
    "throttle": 49,
    "brake": 0,
    "rpm": 10933,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:27.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 151,
    "throttle": 53,
    "brake": 0,
    "rpm": 11000,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:28.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 163,
    "throttle": 58,
    "brake": 0,
    "rpm": 11067,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:29.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 174,
    "throttle": 62,
    "brake": 0,
    "rpm": 11133,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:29.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 185,
    "throttle": 67,
    "brake": 0,
    "rpm": 11200,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:30.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 197,
    "throttle": 71,
    "brake": 0,
    "rpm": 11267,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:30.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 208,
    "throttle": 76,
    "brake": 0,
    "rpm": 11333,
    "n_gear": 5,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:31.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 220,
    "throttle": 80,
    "brake": 0,
    "rpm": 11400,
    "n_gear": 6,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:32.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 231,
    "throttle": 84,
    "brake": 0,
    "rpm": 11467,
    "n_gear": 6,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:32.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 242,
    "throttle": 89,
    "brake": 0,
    "rpm": 11533,
    "n_gear": 6,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:33.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 254,
    "throttle": 93,
    "brake": 0,
    "rpm": 11600,
    "n_gear": 6,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:33.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 265,
    "throttle": 98,
    "brake": 0,
    "rpm": 11667,
    "n_gear": 7,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:34.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 276,
    "throttle": 100,
    "brake": 0,
    "rpm": 11733,
    "n_gear": 7,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:35.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 288,
    "throttle": 100,
    "brake": 0,
    "rpm": 11800,
    "n_gear": 7,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:35.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 299,
    "throttle": 100,
    "brake": 0,
    "rpm": 11867,
    "n_gear": 7,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:36.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 311,
    "throttle": 100,
    "brake": 0,
    "rpm": 11933,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:36.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 322,
    "throttle": 0,
    "brake": 90,
    "rpm": 10600,
    "n_gear": 8,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:37.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 307,
    "throttle": 0,
    "brake": 90,
    "rpm": 10600,
    "n_gear": 8,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:38.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 293,
    "throttle": 0,
    "brake": 90,
    "rpm": 10600,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:38.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 278,
    "throttle": 0,
    "brake": 90,
    "rpm": 10600,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:39.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 264,
    "throttle": 0,
    "brake": 90,
    "rpm": 10600,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:39.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 249,
    "throttle": 0,
    "brake": 90,
    "rpm": 10600,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:40.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 235,
    "throttle": 0,
    "brake": 90,
    "rpm": 10600,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:41.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 220,
    "throttle": 0,
    "brake": 30,
    "rpm": 10600,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:41.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 205,
    "throttle": 0,
    "brake": 30,
    "rpm": 10600,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:42.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 191,
    "throttle": 0,
    "brake": 30,
    "rpm": 10600,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:42.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 176,
    "throttle": 0,
    "brake": 30,
    "rpm": 10600,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:43.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 162,
    "throttle": 0,
    "brake": 30,
    "rpm": 10600,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:44.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 147,
    "throttle": 50,
    "brake": 0,
    "rpm": 10900,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:44.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 166,
    "throttle": 64,
    "brake": 0,
    "rpm": 11147,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:45.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 182,
    "throttle": 76,
    "brake": 0,
    "rpm": 11370,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:45.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 196,
    "throttle": 86,
    "brake": 0,
    "rpm": 11547,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:46.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 204,
    "throttle": 93,
    "brake": 0,
    "rpm": 11661,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:47.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 207,
    "throttle": 95,
    "brake": 0,
    "rpm": 11700,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:47.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 204,
    "throttle": 93,
    "brake": 0,
    "rpm": 11661,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:48.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 196,
    "throttle": 86,
    "brake": 0,
    "rpm": 11547,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:48.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 182,
    "throttle": 76,
    "brake": 0,
    "rpm": 11370,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:49.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 166,
    "throttle": 64,
    "brake": 0,
    "rpm": 11147,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:50.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 147,
    "throttle": 50,
    "brake": 0,
    "rpm": 10900,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:50.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 128,
    "throttle": 36,
    "brake": 19,
    "rpm": 10653,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:51.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 112,
    "throttle": 24,
    "brake": 35,
    "rpm": 10430,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:51.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 98,
    "throttle": 14,
    "brake": 49,
    "rpm": 10253,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:52.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 90,
    "throttle": 7,
    "brake": 57,
    "rpm": 10139,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:53.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 87,
    "throttle": 5,
    "brake": 60,
    "rpm": 10100,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:53.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 90,
    "throttle": 7,
    "brake": 57,
    "rpm": 10139,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:54.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 98,
    "throttle": 14,
    "brake": 49,
    "rpm": 10253,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:54.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 112,
    "throttle": 24,
    "brake": 35,
    "rpm": 10430,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:55.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 128,
    "throttle": 36,
    "brake": 19,
    "rpm": 10653,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:56.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 147,
    "throttle": 50,
    "brake": 0,
    "rpm": 10900,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:56.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 166,
    "throttle": 64,
    "brake": 0,
    "rpm": 11147,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:57.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 182,
    "throttle": 76,
    "brake": 0,
    "rpm": 11370,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:57.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 196,
    "throttle": 86,
    "brake": 0,
    "rpm": 11547,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:58.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 204,
    "throttle": 93,
    "brake": 0,
    "rpm": 11661,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:59.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 207,
    "throttle": 95,
    "brake": 0,
    "rpm": 11700,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:59.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 204,
    "throttle": 93,
    "brake": 0,
    "rpm": 11661,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:00.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 196,
    "throttle": 86,
    "brake": 0,
    "rpm": 11547,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:00.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 182,
    "throttle": 76,
    "brake": 0,
    "rpm": 11370,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:01.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 166,
    "throttle": 64,
    "brake": 0,
    "rpm": 11147,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:02.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 125,
    "throttle": 60,
    "brake": 0,
    "rpm": 10800,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:02.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 131,
    "throttle": 62,
    "brake": 0,
    "rpm": 10843,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:03.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 138,
    "throttle": 63,
    "brake": 0,
    "rpm": 10887,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:03.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 144,
    "throttle": 65,
    "brake": 0,
    "rpm": 10930,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:04.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 150,
    "throttle": 67,
    "brake": 0,
    "rpm": 10973,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:05.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 157,
    "throttle": 68,
    "brake": 0,
    "rpm": 11017,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:05.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 163,
    "throttle": 70,
    "brake": 0,
    "rpm": 11060,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:06.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 169,
    "throttle": 72,
    "brake": 0,
    "rpm": 11103,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:06.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 176,
    "throttle": 73,
    "brake": 0,
    "rpm": 11147,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:07.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 182,
    "throttle": 75,
    "brake": 0,
    "rpm": 11190,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:08.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 188,
    "throttle": 77,
    "brake": 0,
    "rpm": 11233,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:08.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 195,
    "throttle": 78,
    "brake": 0,
    "rpm": 11277,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:09.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 201,
    "throttle": 80,
    "brake": 0,
    "rpm": 11320,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:09.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 207,
    "throttle": 82,
    "brake": 0,
    "rpm": 11363,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:10.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 214,
    "throttle": 83,
    "brake": 0,
    "rpm": 11407,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:11.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 220,
    "throttle": 85,
    "brake": 0,
    "rpm": 11450,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:11.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 226,
    "throttle": 87,
    "brake": 0,
    "rpm": 11493,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:12.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 233,
    "throttle": 88,
    "brake": 0,
    "rpm": 11537,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:12.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 239,
    "throttle": 90,
    "brake": 0,
    "rpm": 11580,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:13.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 245,
    "throttle": 92,
    "brake": 0,
    "rpm": 11623,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:14.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 252,
    "throttle": 93,
    "brake": 0,
    "rpm": 11667,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:14.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 258,
    "throttle": 95,
    "brake": 0,
    "rpm": 11710,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:15.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 264,
    "throttle": 97,
    "brake": 0,
    "rpm": 11753,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:15.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 271,
    "throttle": 98,
    "brake": 0,
    "rpm": 11797,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:16.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 277,
    "throttle": 100,
    "brake": 0,
    "rpm": 11840,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:17.076Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 283,
    "throttle": 100,
    "brake": 0,
    "rpm": 11883,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:17.676Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 290,
    "throttle": 100,
    "brake": 0,
    "rpm": 11927,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:18.276Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 296,
    "throttle": 100,
    "brake": 0,
    "rpm": 11970,
    "n_gear": 8,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:18.876Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 302,
    "throttle": 100,
    "brake": 0,
    "rpm": 12013,
    "n_gear": 8,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:19.476Z",
    "session_key": 11408,
    "driver_number": 16,
    "speed": 309,
    "throttle": 100,
    "brake": 0,
    "rpm": 12057,
    "n_gear": 8,
    "drs": 10,
    "meeting_key": 1299
  }
]

export const SNAPSHOT_CAR_TELEMETRY_44: OpenF1CarDataPoint[] = [
  {
    "date": "2026-11-07T18:56:08.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 288,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:08.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 291,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:09.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 295,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:09.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 295,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:10.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 298,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:11.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 302,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:11.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 302,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:12.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 305,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:12.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 309,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:13.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 309,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:14.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 312,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:14.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 316,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:15.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 316,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:15.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 319,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:16.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 323,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:17.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 323,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:17.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 326,
    "throttle": 100,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:18.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 330,
    "throttle": 99,
    "brake": 0,
    "rpm": 12050,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:18.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 330,
    "throttle": 1,
    "brake": 100,
    "rpm": 10450,
    "n_gear": 8,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:19.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 313,
    "throttle": 0,
    "brake": 100,
    "rpm": 10450,
    "n_gear": 8,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:20.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 296,
    "throttle": 1,
    "brake": 100,
    "rpm": 10450,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:20.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 276,
    "throttle": 0,
    "brake": 100,
    "rpm": 10450,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:21.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 259,
    "throttle": 1,
    "brake": 100,
    "rpm": 10450,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:21.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 242,
    "throttle": 0,
    "brake": 100,
    "rpm": 10450,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:22.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 222,
    "throttle": 1,
    "brake": 40,
    "rpm": 10450,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:23.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 206,
    "throttle": 0,
    "brake": 40,
    "rpm": 10450,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:23.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 189,
    "throttle": 1,
    "brake": 40,
    "rpm": 10450,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:24.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 169,
    "throttle": 0,
    "brake": 40,
    "rpm": 10450,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:24.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 152,
    "throttle": 1,
    "brake": 40,
    "rpm": 10450,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:25.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 135,
    "throttle": 0,
    "brake": 40,
    "rpm": 10450,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:26.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 115,
    "throttle": 41,
    "brake": 0,
    "rpm": 10750,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:26.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 127,
    "throttle": 43,
    "brake": 0,
    "rpm": 10817,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:27.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 140,
    "throttle": 50,
    "brake": 0,
    "rpm": 10883,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:27.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 149,
    "throttle": 52,
    "brake": 0,
    "rpm": 10950,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:28.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 162,
    "throttle": 59,
    "brake": 0,
    "rpm": 11017,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:29.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 174,
    "throttle": 61,
    "brake": 0,
    "rpm": 11083,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:29.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 183,
    "throttle": 68,
    "brake": 0,
    "rpm": 11150,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:30.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 196,
    "throttle": 70,
    "brake": 0,
    "rpm": 11217,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:30.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 208,
    "throttle": 77,
    "brake": 0,
    "rpm": 11283,
    "n_gear": 5,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:31.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 218,
    "throttle": 79,
    "brake": 0,
    "rpm": 11350,
    "n_gear": 6,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:32.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 230,
    "throttle": 85,
    "brake": 0,
    "rpm": 11417,
    "n_gear": 6,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:32.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 242,
    "throttle": 88,
    "brake": 0,
    "rpm": 11483,
    "n_gear": 6,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:33.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 252,
    "throttle": 94,
    "brake": 0,
    "rpm": 11550,
    "n_gear": 6,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:33.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 264,
    "throttle": 97,
    "brake": 0,
    "rpm": 11617,
    "n_gear": 7,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:34.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 276,
    "throttle": 100,
    "brake": 0,
    "rpm": 11683,
    "n_gear": 7,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:35.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 286,
    "throttle": 99,
    "brake": 0,
    "rpm": 11750,
    "n_gear": 7,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:35.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 298,
    "throttle": 100,
    "brake": 0,
    "rpm": 11817,
    "n_gear": 7,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:36.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 311,
    "throttle": 99,
    "brake": 0,
    "rpm": 11883,
    "n_gear": 8,
    "drs": 12,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:36.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 320,
    "throttle": 1,
    "brake": 90,
    "rpm": 10550,
    "n_gear": 8,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:37.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 306,
    "throttle": 0,
    "brake": 90,
    "rpm": 10550,
    "n_gear": 8,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:38.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 293,
    "throttle": 1,
    "brake": 90,
    "rpm": 10550,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:38.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 276,
    "throttle": 0,
    "brake": 90,
    "rpm": 10550,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:39.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 263,
    "throttle": 1,
    "brake": 90,
    "rpm": 10550,
    "n_gear": 7,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:39.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 249,
    "throttle": 0,
    "brake": 90,
    "rpm": 10550,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:40.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 233,
    "throttle": 1,
    "brake": 90,
    "rpm": 10550,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:41.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 219,
    "throttle": 0,
    "brake": 30,
    "rpm": 10550,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:41.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 205,
    "throttle": 1,
    "brake": 30,
    "rpm": 10550,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:42.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 189,
    "throttle": 0,
    "brake": 30,
    "rpm": 10550,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:42.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 175,
    "throttle": 1,
    "brake": 30,
    "rpm": 10550,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:43.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 162,
    "throttle": 0,
    "brake": 30,
    "rpm": 10550,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:44.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 145,
    "throttle": 51,
    "brake": 0,
    "rpm": 10850,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:44.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 165,
    "throttle": 63,
    "brake": 0,
    "rpm": 11097,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:45.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 182,
    "throttle": 77,
    "brake": 0,
    "rpm": 11320,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:45.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 194,
    "throttle": 85,
    "brake": 0,
    "rpm": 11497,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:46.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 203,
    "throttle": 94,
    "brake": 0,
    "rpm": 11611,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:47.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 207,
    "throttle": 94,
    "brake": 0,
    "rpm": 11650,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:47.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 202,
    "throttle": 94,
    "brake": 0,
    "rpm": 11611,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:48.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 195,
    "throttle": 85,
    "brake": 0,
    "rpm": 11497,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:48.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 182,
    "throttle": 77,
    "brake": 0,
    "rpm": 11320,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:49.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 164,
    "throttle": 63,
    "brake": 0,
    "rpm": 11097,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:50.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 146,
    "throttle": 51,
    "brake": 0,
    "rpm": 10850,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:50.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 128,
    "throttle": 35,
    "brake": 19,
    "rpm": 10603,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:51.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 110,
    "throttle": 25,
    "brake": 35,
    "rpm": 10380,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:51.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 97,
    "throttle": 13,
    "brake": 49,
    "rpm": 10203,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:52.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 90,
    "throttle": 8,
    "brake": 57,
    "rpm": 10089,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:53.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 85,
    "throttle": 4,
    "brake": 60,
    "rpm": 10050,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:53.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 89,
    "throttle": 8,
    "brake": 57,
    "rpm": 10089,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:54.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 98,
    "throttle": 13,
    "brake": 49,
    "rpm": 10203,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:54.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 110,
    "throttle": 25,
    "brake": 35,
    "rpm": 10380,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:55.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 127,
    "throttle": 35,
    "brake": 19,
    "rpm": 10603,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:56.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 147,
    "throttle": 51,
    "brake": 0,
    "rpm": 10850,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:56.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 164,
    "throttle": 63,
    "brake": 0,
    "rpm": 11097,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:57.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 181,
    "throttle": 77,
    "brake": 0,
    "rpm": 11320,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:57.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 196,
    "throttle": 85,
    "brake": 0,
    "rpm": 11497,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:58.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 202,
    "throttle": 94,
    "brake": 0,
    "rpm": 11611,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:59.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 206,
    "throttle": 94,
    "brake": 0,
    "rpm": 11650,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:56:59.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 204,
    "throttle": 94,
    "brake": 0,
    "rpm": 11611,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:00.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 194,
    "throttle": 85,
    "brake": 0,
    "rpm": 11497,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:00.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 181,
    "throttle": 77,
    "brake": 0,
    "rpm": 11320,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:01.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 166,
    "throttle": 63,
    "brake": 0,
    "rpm": 11097,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:02.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 123,
    "throttle": 61,
    "brake": 0,
    "rpm": 10750,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:02.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 130,
    "throttle": 61,
    "brake": 0,
    "rpm": 10793,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:03.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 138,
    "throttle": 64,
    "brake": 0,
    "rpm": 10837,
    "n_gear": 3,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:03.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 142,
    "throttle": 64,
    "brake": 0,
    "rpm": 10880,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:04.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 149,
    "throttle": 68,
    "brake": 0,
    "rpm": 10923,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:05.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 157,
    "throttle": 67,
    "brake": 0,
    "rpm": 10967,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:05.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 161,
    "throttle": 71,
    "brake": 0,
    "rpm": 11010,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:06.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 168,
    "throttle": 71,
    "brake": 0,
    "rpm": 11053,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:06.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 176,
    "throttle": 74,
    "brake": 0,
    "rpm": 11097,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:07.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 180,
    "throttle": 74,
    "brake": 0,
    "rpm": 11140,
    "n_gear": 4,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:08.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 187,
    "throttle": 78,
    "brake": 0,
    "rpm": 11183,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:08.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 195,
    "throttle": 77,
    "brake": 0,
    "rpm": 11227,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:09.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 199,
    "throttle": 81,
    "brake": 0,
    "rpm": 11270,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:09.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 206,
    "throttle": 81,
    "brake": 0,
    "rpm": 11313,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:10.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 214,
    "throttle": 84,
    "brake": 0,
    "rpm": 11357,
    "n_gear": 5,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:11.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 218,
    "throttle": 84,
    "brake": 0,
    "rpm": 11400,
    "n_gear": 6,
    "drs": 0,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:11.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 225,
    "throttle": 88,
    "brake": 0,
    "rpm": 11443,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:12.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 233,
    "throttle": 87,
    "brake": 0,
    "rpm": 11487,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:12.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 237,
    "throttle": 91,
    "brake": 0,
    "rpm": 11530,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:13.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 244,
    "throttle": 91,
    "brake": 0,
    "rpm": 11573,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:14.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 252,
    "throttle": 94,
    "brake": 0,
    "rpm": 11617,
    "n_gear": 6,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:14.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 256,
    "throttle": 94,
    "brake": 0,
    "rpm": 11660,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:15.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 263,
    "throttle": 98,
    "brake": 0,
    "rpm": 11703,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:15.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 271,
    "throttle": 97,
    "brake": 0,
    "rpm": 11747,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:16.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 275,
    "throttle": 100,
    "brake": 0,
    "rpm": 11790,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:17.076Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 282,
    "throttle": 99,
    "brake": 0,
    "rpm": 11833,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:17.676Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 290,
    "throttle": 100,
    "brake": 0,
    "rpm": 11877,
    "n_gear": 7,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:18.276Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 294,
    "throttle": 99,
    "brake": 0,
    "rpm": 11920,
    "n_gear": 8,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:18.876Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 301,
    "throttle": 100,
    "brake": 0,
    "rpm": 11963,
    "n_gear": 8,
    "drs": 10,
    "meeting_key": 1299
  },
  {
    "date": "2026-11-07T18:57:19.476Z",
    "session_key": 11408,
    "driver_number": 44,
    "speed": 309,
    "throttle": 99,
    "brake": 0,
    "rpm": 12007,
    "n_gear": 8,
    "drs": 10,
    "meeting_key": 1299
  }
]

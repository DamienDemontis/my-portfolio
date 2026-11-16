// Les 25 case studies du site, extraites du bundle deploye.
// Chaque entree : slug, code, year, projectType, accent, icon, image, seoTag,
// customer, partner, copy{en,it} et sections[] (splitIntro, imageGrid,
// videoGrid, deviceShowcase, imageCarousel, videoPlayer).
export const caseHistories = [
  {
    "slug": "berco-supersize",
    "code": "MSN_001",
    "year": "2025",
    "projectType": "brand experience",
    "accent": "#feff00",
    "icon": "/case/berco/berco-icon.svg",
    "image": "/case/berco/berco-hero.webp",
    "seoTag": "Exhibition Game",
    "customer": "Berco",
    "partner": "PoliedroStudio",
    "copy": {
      "en": {
        "category": "Exhibition Experience / Arcade Gameplay / Industrial Product",
        "title": "Berco Supersize",
        "excerpt": "A brand experience for Berco at Bauma 2025: arcade gameplay turns the trade-show stand into a place to explore industrial products.",
        "intro": "Berco Supersize is an arcade video game created for the Berco stand at Bauma 2025, in collaboration with PoliedroStudio. Visitors take control of an industrial operator and clear challenges built around Berco products, discovering their applications and features as they play. The goal is to make technical communication more immediate and to actively engage the trade-show audience.",
        "status": "ENGINE ON // {_READY_TO_BUILD?}",
        "capabilities": [
          "Real-Time Development",
          "3D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Web",
          "Interactive Screen"
        ]
      },
      "it": {
        "category": "Exhibition Experience / Arcade Gameplay / Industrial Product",
        "title": "Berco Supersize",
        "excerpt": "Un’esperienza di brand per Berco a Bauma 2025: il gioco arcade trasforma lo stand in uno spazio in cui scoprire i prodotti industriali.",
        "intro": "Berco Supersize è un videogioco arcade realizzato per lo stand Berco a Bauma 2025, in collaborazione con PoliedroStudio. Il visitatore controlla un operatore industriale e supera prove costruite attorno ai prodotti Berco, scoprendone applicazioni e caratteristiche mentre gioca. L’obiettivo è rendere la comunicazione tecnica più immediata e coinvolgere attivamente il pubblico della fiera.",
        "status": "ENGINE ON // {_READY_TO_BUILD?}",
        "capabilities": [
          "Real-Time Development",
          "3D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Web",
          "Interactive Screen"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "The stand becomes an interactive system",
          "it": "Lo stand diventa un sistema interattivo"
        },
        "text": {
          "en": [
            "Supersize was developed for the Berco stand at Bauma 2025.",
            "Visitors step into the role of an industrial operator and take on challenges built around the company's products."
          ],
          "it": [
            "Supersize è stato sviluppato per lo stand Berco a Bauma 2025.",
            "Il visitatore assume il ruolo di un operatore industriale e affronta prove costruite attorno ai prodotti dell’azienda."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/berco/berco-stand.webp",
            "alt": {
              "it": "Berco interactive installation",
              "en": "Berco interactive installation"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Understanding the product by using it",
          "it": "Capire il prodotto usandolo"
        },
        "text": {
          "en": [
            "Every challenge introduces the applications, features and versatility of Berco components.",
            "Gameplay replaces the linear presentation with a direct, memorable demonstration."
          ],
          "it": [
            "Ogni sfida introduce applicazioni, caratteristiche e versatilità dei componenti Berco.",
            "Il gameplay sostituisce la presentazione lineare con una dimostrazione diretta e memorabile."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/berco/berco-level-1.mp4",
            "alt": {
              "it": "Berco Supersize Level 1",
              "en": "Berco Supersize level 1"
            }
          },
          {
            "src": "/case/berco/berco-level-2.mp4",
            "alt": {
              "it": "Berco Supersize Level 2",
              "en": "Berco Supersize level 2"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Industrial communication, arcade format",
          "it": "Comunicazione industriale, formato Arcade"
        },
        "text": {
          "en": [
            "PoliedroStudio and Studio MACACO designed an experience that brings together brand message, play and exhibition space.",
            "The result pulls the audience into the Berco universe instead of leaving them in front of a presentation."
          ],
          "it": [
            "PoliedroStudio e Studio MACACO hanno progettato un’esperienza capace di integrare messaggio di marca, gioco e spazio fieristico.",
            "Il risultato porta il pubblico dentro l’universo Berco invece di lasciarlo davanti a una presentazione."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/berco/berco-level-1.webp",
            "alt": {
              "it": "Berco Supersize Level 1",
              "en": "Berco Supersize level 1"
            }
          },
          {
            "src": "/case/berco/berco-level-2.webp",
            "alt": {
              "it": "Berco Supersize Level 2",
              "en": "Berco Supersize level 2"
            }
          },
          {
            "src": "/case/berco/berco-level-3.webp",
            "alt": {
              "it": "Berco Supersize Level 3",
              "en": "Berco Supersize level 3"
            }
          },
          {
            "src": "/case/berco/berco-level-4.webp",
            "alt": {
              "it": "Berco Supersize Level 4",
              "en": "Berco Supersize level 4"
            }
          }
        ]
      },
      {
        "type": "videoPlayer",
        "video": {
          "src": "/case/berco/berco-trailer.mp4",
          "poster": "/case/berco/berco-vertical-cover.webp",
          "playIcon": "/general/play-icon.svg",
          "ariaLabel": {
            "it": "Berco Supersize Gameplay Trailer",
            "en": "Berco Supersize gameplay trailer"
          },
          "preload": "metadata"
        }
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "An editor built around game design",
          "it": "Un editor costruito attorno al Game Design"
        },
        "text": {
          "en": [
            "A custom editor was developed for Supersize, letting the game designer build and modify the levels but also play them, speeding up iteration and testing.",
            "The machines in the game were made to measure too: custom 3D models, modelled and textured in Substance to stay recognisable and consistent with the Berco world."
          ],
          "it": [
            "Per Supersize è stato sviluppato un editor custom che permette al game designer di costruire e modificare i livelli ma anche di giocarli, velocizzando iterazioni e testing.",
            "Anche i mezzi utilizzati nel gioco sono stati realizzati su misura: modelli 3D custom, modellati e texturizzati in Substance per mantenere riconoscibilità e coerenza con il mondo Berco."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/berco/berco-editor.mp4",
            "poster": "/case/berco/berco-editor.webp",
            "alt": {
              "it": "Berco Supersize Level Editor",
              "en": "Berco Supersize level editor"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/berco/berco-engine-1.webp",
            "alt": {
              "it": "Berco Supersize Work",
              "en": "Berco Supersize work in progress"
            }
          },
          {
            "src": "/case/berco/berco-engine-2.webp",
            "alt": {
              "it": "Berco Supersize Work",
              "en": "Berco Supersize work in progress"
            }
          },
          {
            "src": "/case/berco/berco-engine-3.webp",
            "alt": {
              "it": "Berco Supersize Work",
              "en": "Berco Supersize work in progress"
            }
          },
          {
            "src": "/case/berco/berco-engine-4.webp",
            "alt": {
              "it": "Berco Supersize Work",
              "en": "Berco Supersize work in progress"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "digitart-3d-giulia-caffo",
    "code": "MSN_002",
    "year": "2025",
    "projectType": [
      "cultural experience",
      "games"
    ],
    "accent": "#7F3AEF",
    "icon": "/case/giuliacaffo/giuliacaffo-icon.svg",
    "image": "/case/giuliacaffo/giuliacaffo-hero.webp",
    "seoTag": "Museum Experience",
    "customer": "Museo della Ceramica Giuseppe Roi",
    "partner": "",
    "copy": {
      "en": {
        "category": "Museum Experience / Interactive Story / Accessible 3D",
        "title": "Digiart 3D: Giulia Caffo",
        "excerpt": "Five chapters, five minigames and a ceramics collection made explorable through two large touch tables.",
        "intro": "DigitArt 3D: Le ceramiche di Giulia Caffo is an interactive museum installation hosted at Palazzo Sturm, home of the Giuseppe Roi Ceramics Museum. Through two touch tables, visitors can follow a story in five chapters, play with the ceramics and examine the objects of the collection in 3D. Tactile 3D-printed reproductions also make part of the content accessible to blind and partially sighted visitors.",
        "status": "POTTERY IN MAKING // {_SOME_TEA?}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "2D/3D Art",
          "Storytelling",
          "Unity3D"
        ],
        "platforms": [
          "Interactive Display"
        ]
      },
      "it": {
        "category": "Museum Experience / Interactive Story / Accessible 3D",
        "title": "Digiart 3D: Giulia Caffo",
        "excerpt": "Cinque capitoli, cinque minigiochi e una collezione ceramica resa esplorabile attraverso due grandi tavoli touch.",
        "intro": "DigitArt 3D: Le ceramiche di Giulia Caffo è un’installazione museale interattiva ospitata a Palazzo Sturm, sede del Museo della Ceramica Giuseppe Roi. Attraverso due tavoli touch, i visitatori possono seguire una storia in cinque capitoli, giocare con le ceramiche e osservare in 3D gli oggetti della collezione. Riproduzioni tattili stampate in 3D rendono inoltre alcuni contenuti accessibili a persone non vedenti e ipovedenti.",
        "status": "POTTERY IN MAKING // {_SOME_TEA?}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "2D/3D Art",
          "Storytelling",
          "Unity3D"
        ],
        "platforms": [
          "Interactive Display"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "The objects enter the story",
          "it": "Gli oggetti entrano nel racconto"
        },
        "text": {
          "en": [
            "The experience tells a fictionalised version of Giulia Caffo's life through ceramic objects from the nineteenth and twentieth centuries.",
            "Each chapter links a stage of the narrative to a minigame, turning the collection into an active part of the story."
          ],
          "it": [
            "L’esperienza racconta una versione romanzata della vita di Giulia Caffo attraverso oggetti ceramici tra Ottocento e Novecento.",
            "Ogni capitolo collega una fase narrativa a un minigioco, trasformando la collezione in parte attiva della storia."
          ]
        }
      },
      {
        "type": "videoPlayer",
        "label": {
          "en": "Documentary video of the experience",
          "it": "Video Documentario Esperienza"
        },
        "video": {
          "src": "/case/giuliacaffo/giuliacaffo-video.mp4",
          "poster": "/case/giuliacaffo/giuliacaffo-video-cover.webp",
          "playIcon": "/general/play-icon.svg",
          "ariaLabel": {
            "it": "Le Ceramiche di Giulia Caffo",
            "en": "The ceramics of Giulia Caffo"
          },
          "preload": "metadata"
        }
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Tell, play, explore",
          "it": "Raccontare, giocare, esplorare"
        },
        "text": {
          "en": [
            "Visitors can follow the whole story, jump straight into the minigames or examine the ceramics in the 3D viewer.",
            "A creative mode lets them decorate the objects, working on shapes and colours by touch."
          ],
          "it": [
            "Il visitatore può seguire la storia completa, accedere direttamente ai minigiochi oppure osservare le ceramiche nel visualizzatore 3D.",
            "Una modalità creativa permette di decorare gli oggetti intervenendo su forme e colori tramite touch."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/giuliacaffo/giuliacaffo-gioco-caduta.mp4",
            "poster": "/case/giuliacaffo/giuliacaffo-cover-caduta.webp",
            "alt": {
              "it": "Giulia Caffo Gioco Caduta",
              "en": "Giulia Caffo falling minigame"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-gioco-tazzine.mp4",
            "poster": "/case/giuliacaffo/giuliacaffo-cover-tazzine.webp",
            "alt": {
              "it": "Giulia Caffo Gioco Tazzine",
              "en": "Giulia Caffo teacups minigame"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-gioco-medicine.mp4",
            "poster": "/case/giuliacaffo/giuliacaffo-cover-medicine.webp",
            "alt": {
              "it": "Giulia Caffo Gioco Medicine",
              "en": "Giulia Caffo medicines minigame"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-gioco-puzzle.mp4",
            "poster": "/case/giuliacaffo/giuliacaffo-cover-puzzle.webp",
            "alt": {
              "it": "Giulia Caffo Gioco Puzzle",
              "en": "Giulia Caffo puzzle minigame"
            }
          }
        ]
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/giuliacaffo/giuliacaffo-gioco-pittura.mp4",
            "poster": "/case/giuliacaffo/giuliacaffo-cover-pittura.webp",
            "alt": {
              "it": "Giulia Caffo Gioco Pittura",
              "en": "Giulia Caffo painting minigame"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "The illustrated story of Giulia Caffo",
          "it": "La storia illustrata di Giulia Caffo"
        },
        "images": [
          {
            "src": "/case/giuliacaffo/giuliacaffo-story-1.webp",
            "alt": {
              "it": "Storia di Giulia Caffo",
              "en": "The story of Giulia Caffo"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-story-2.webp",
            "alt": {
              "it": "Storia di Giulia Caffo",
              "en": "The story of Giulia Caffo"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-story-3.webp",
            "alt": {
              "it": "Storia di Giulia Caffo",
              "en": "The story of Giulia Caffo"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-story-4.webp",
            "alt": {
              "it": "Storia di Giulia Caffo",
              "en": "The story of Giulia Caffo"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-story-5.webp",
            "alt": {
              "it": "Storia di Giulia Caffo",
              "en": "The story of Giulia Caffo"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-story-6.webp",
            "alt": {
              "it": "Storia di Giulia Caffo",
              "en": "The story of Giulia Caffo"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-story-7.webp",
            "alt": {
              "it": "Storia di Giulia Caffo",
              "en": "The story of Giulia Caffo"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-story-8.webp",
            "alt": {
              "it": "Storia di Giulia Caffo",
              "en": "The story of Giulia Caffo"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Digital made accessible",
          "it": "Il digitale diventa accessibile"
        },
        "text": {
          "en": [
            "Two large touch tables make the interaction immediate for very different audiences.",
            "3D-printed reproductions with raised elements sit alongside the screen and widen accessibility for blind and partially sighted visitors."
          ],
          "it": [
            "Due grandi tavoli touch rendono l’interazione immediata per pubblici diversi.",
            "Riproduzioni stampate in 3D con elementi in rilievo affiancano lo schermo e ampliano l’accessibilità per persone non vedenti e ipovedenti."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/giuliacaffo/giuliacaffo-orciolo.mp4",
            "poster": "/case/giuliacaffo/giuliacaffo-cover-orciolo.webp",
            "alt": {
              "it": "Giulia Caffo Orciolo da Farmacia",
              "en": "Giulia Caffo pharmacy jar"
            }
          },
          {
            "src": "/case/giuliacaffo/giuliacaffo-tazzina.mp4",
            "poster": "/case/giuliacaffo/giuliacaffo-cover-tazzina.webp",
            "alt": {
              "it": "Giulia Caffo Tazzina Antonibon",
              "en": "Giulia Caffo Antonibon cup"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "segui-il-tubo",
    "code": "MSN_004",
    "year": "2025",
    "projectType": [
      "brand experience",
      "games",
      "games for impact"
    ],
    "accent": "#7FFFFF",
    "icon": "/case/seguitubo/seguitubo-icon.svg",
    "image": "/case/seguitubo/seguitubo-hero.webp",
    "seoTag": "Web Game",
    "customer": "CDALED",
    "partner": "",
    "copy": {
      "en": {
        "category": "Web Game / Water Education / Gamification",
        "title": "Segui il Tubo",
        "excerpt": "Two web games explain what happens before and after the drain, turning water management into a system you can grasp.",
        "intro": "Segui il Tubo is a digital education project developed for CDALED and made up of two browser-based games. Ninja del Water teaches which objects must never be flushed down the toilet; Il Viaggio dell'Acqua shows the stages wastewater goes through on its way to treatment. The games are aimed at children, teenagers and families and can support classroom activities and guided tours.",
        "status": "DOWN THE TUBE // {_DO_YOU_WANT_TO_KNOW?}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "2D/3D Art"
        ],
        "platforms": [
          "Web"
        ]
      },
      "it": {
        "category": "Web Game / Water Education / Gamification",
        "title": "Segui il Tubo",
        "excerpt": "Due web game spiegano cosa accade prima e dopo lo scarico, trasformando la gestione dell’acqua in un sistema comprensibile.",
        "intro": "Segui il Tubo è un progetto educativo digitale sviluppato per CDALED e composto da due giochi accessibili via browser. Ninja del Water insegna quali oggetti non devono essere gettati nel WC; Il Viaggio dell’Acqua mostra invece le fasi attraversate dalle acque reflue fino alla depurazione. I giochi sono destinati a bambini, ragazzi e famiglie e possono accompagnare attività didattiche e visite guidate.",
        "status": "DOWN THE TUBE // {_DO_YOU_WANT_TO_KNOW?}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "2D/3D Art"
        ],
        "platforms": [
          "Web"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "What can go down the toilet?",
          "it": "Cosa può finire nel WC?"
        },
        "text": {
          "en": [
            "Ninja del Water asks players to tell apart the objects that can be flushed from the ones that damage sewers and treatment plants.",
            "A scored challenge links everyday actions to their consequences for the water system."
          ],
          "it": [
            "Ninja del Water chiede al giocatore di distinguere gli oggetti smaltibili da quelli che danneggiano reti fognarie e depuratori.",
            "Una sfida a punti collega azioni quotidiane e conseguenze sul sistema idrico."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/seguitubo/seguitubo-ninja-mobile-loop.mp4",
            "poster": "/case/seguitubo/seguitubo-cover-3.webp",
            "alt": {
              "it": "Segui il Tubo Ninja del Water",
              "en": "Segui il Tubo, Ninja del Water"
            }
          }
        ]
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/seguitubo/seguitubo-ninja-desktop-loop.mp4",
            "poster": "/case/seguitubo/seguitubo-cover-1.webp",
            "alt": {
              "it": "Segui il Tubo Ninja del Water",
              "en": "Segui il Tubo, Ninja del Water"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Following the water to the lake",
          "it": "Seguire l'acqua fino al lago"
        },
        "text": {
          "en": [
            "Il Viaggio dell'Acqua retraces the route wastewater takes from homes to the plant.",
            "Each stage shows how the water is treated before being returned to the ecosystem."
          ],
          "it": [
            "Il Viaggio dell’Acqua ricostruisce il percorso delle acque reflue dalle abitazioni all’impianto.",
            "Ogni fase mostra come l’acqua viene trattata prima di essere restituita agli ecosistemi."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/seguitubo/seguitubo-tubo-loop-1.mp4",
            "alt": {
              "it": "Segui il Tubo, il percorso dell'acqua",
              "en": "Segui il Tubo, the journey of water"
            }
          },
          {
            "src": "/case/seguitubo/seguitubo-tubo-loop-2.mp4",
            "alt": {
              "it": "Segui il Tubo, il percorso dell'acqua",
              "en": "Segui il Tubo, the journey of water"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Learning that runs in the browser",
          "it": "Formazione disponibile nel browser"
        },
        "text": {
          "en": [
            "The two games work as standalone experiences and as support for CDALED's educational activities.",
            "The web format makes them available to children, teenagers and families with nothing to install."
          ],
          "it": [
            "I due giochi funzionano come esperienze autonome e come supporto alle attività educative di CDALED.",
            "Il formato web li rende accessibili a bambini, ragazzi e famiglie senza installazioni dedicate."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/seguitubo/seguitubo-gameplay-loop.mp4",
            "poster": "/case/seguitubo/seguitubo-cover-2.webp",
            "alt": {
              "it": "Segui il Tubo Gameplay",
              "en": "Segui il Tubo gameplay"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "pastawar",
    "code": "MSN_002",
    "year": "2022",
    "projectType": [
      "ai-experimental",
      "web"
    ],
    "accent": "#7F3AEF",
    "icon": "/case/pastawar/pastawar-icon.svg",
    "image": "/case/pastawar/pastawar-cover.webp",
    "seoTag": "Generative Art",
    "customer": "",
    "partner": "",
    "copy": {
      "en": {
        "category": "generative art / nft collection / web customizer",
        "title": "PastaWar",
        "excerpt": "8,333 warriors generated by combining layers, rarity levels and a collage imagery devoted to pasta.",
        "intro": "Pasta War is an internal experimental project made up of a collection of 8,333 NFTs and a web character generator. The Pasta Warriors are created by combining graphic layers and rarity levels through HashLips Art Engine. Users can also build their own warrior by hand through an animated customisation interface.",
        "status": "WAR NEVER CHANGES // {_REMEMBER_THE_QUOTE?}",
        "capabilities": [
          "Generative Art",
          "Visual Identity",
          "Web Development"
        ],
        "platforms": [
          "Web"
        ]
      },
      "it": {
        "category": "generative art / nft collection / web customizer",
        "title": "PastaWar",
        "excerpt": "8.333 guerrieri generati combinando layer, rarità e un immaginario collage dedicato alla pasta.",
        "intro": "Pasta War è un progetto sperimentale interno composto da una collezione di 8.333 NFT e da un generatore web di personaggi. I Pasta Warrior vengono creati combinando layer grafici e livelli di rarità attraverso HashLips Art Engine. Gli utenti possono inoltre costruire manualmente il proprio guerriero tramite un’interfaccia animata di personalizzazione.",
        "status": "WAR NEVER CHANGES // {_REMEMBER_THE_QUOTE?}",
        "capabilities": [
          "Generative Art",
          "Visual Identity",
          "Web Development"
        ],
        "platforms": [
          "Web"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "8,333 combinations, one world",
          "it": "8.333 combinazioni, un solo mondo"
        },
        "text": {
          "en": [
            "The collection combines graphic elements organised by rarity level.",
            "HashLips Art Engine generates thousands of unique Pasta Warriors while respecting the rules and the visual coherence."
          ],
          "it": [
            "La collezione combina elementi grafici organizzati per livelli di rarità.",
            "HashLips Art Engine genera migliaia di Pasta Warrior unici rispettando regole e coerenza visiva."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/pastawar/pastawar-loop.mp4",
            "poster": "/case/pastawar/pastawar-cover.webp",
            "alt": {
              "it": "PastaWar Loop",
              "en": "PastaWar loop"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Collage becomes identity",
          "it": "Il Collage diventa identità"
        },
        "text": {
          "en": [
            "Accessories, features and details are layered like fragments of a collage.",
            "Art direction keeps the collection recognisable even as every character changes."
          ],
          "it": [
            "Accessori, caratteristiche e dettagli vengono sovrapposti come frammenti di un collage.",
            "La direzione artistica mantiene riconoscibile la collezione anche quando ogni personaggio cambia."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/pastawar/pastawar-trait-loop.mp4",
            "poster": "/case/pastawar/pastwar-single.webp",
            "alt": {
              "it": "PastaWar Trait loop",
              "en": "PastaWar trait loop"
            }
          },
          {
            "src": "/case/pastawar/pastawar-rarity-loop.mp4",
            "poster": "/case/pastawar/pastwar-pope.webp",
            "alt": {
              "it": "PastaWar Rarity loop",
              "en": "PastaWar rarity loop"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Building your own warrior",
          "it": "Costruire il proprio guerriero"
        },
        "text": {
          "en": [
            "A web tool lets users combine the different elements freely.",
            "Animation and feedback turn customisation into an interactive experience, not a plain configurator."
          ],
          "it": [
            "Un software web permette agli utenti di combinare liberamente i diversi elementi.",
            "Animazioni e feedback trasformano la personalizzazione in un’esperienza interattiva, non in un semplice configuratore."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/pastawar/pastawar-composer.mp4",
            "poster": "/case/pastawar/pastawar-hero.webp",
            "alt": {
              "it": "PastaWar Composer",
              "en": "PastaWar composer"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "kebhouze-the-game",
    "code": "MSN_003",
    "year": "2024",
    "projectType": [
      "brand experience",
      "games"
    ],
    "accent": "#feff00",
    "icon": "/case/kebhouze/kebhouze-icon.svg",
    "image": "/case/kebhouze/kebhouze-hero.webp",
    "seoTag": "Brand Game",
    "customer": "Kebhouze",
    "partner": "",
    "copy": {
      "en": {
        "category": "Brand Mascot / Endless Runner / Arcade Multiplayer",
        "title": "Kebhouze The Game",
        "excerpt": "Art direction and 2D/3D art turn the Kebhouze mascot into an arcade world, bringing the brand’s identity into a shared game experience.",
        "intro": "KebHouze The Game is a runner game for arcade cabinets built around Keb, KebHouze's official mascot. Players cross a city, collect prizes and power-ups and dodge obstacles across randomly generated levels. Single player and multiplayer modes plus leaderboards turn the brand's identity into a competitive, replayable experience.",
        "status": "RUN // {_KEB(?)_RUN!}",
        "capabilities": [
          "Art Direction",
          "2D/3D Art"
        ],
        "platforms": [
          "Arcade"
        ]
      },
      "it": {
        "category": "Brand Mascot / Endless Runner / Arcade Multiplayer",
        "title": "Kebhouze The Game",
        "excerpt": "Art direction e arte 2D/3D trasformano la mascotte Kebhouze in un mondo arcade, portando l’identità del brand dentro un’esperienza di gioco condivisa.",
        "intro": "KebHouze The Game è un runner game per cabinato arcade sviluppato attorno a Keb, la mascotte ufficiale di KebHouze. Il giocatore attraversa una città, raccoglie premi e power-up ed evita ostacoli in livelli generati casualmente. Modalità single player, multiplayer e classifiche trasformano l’identità del brand in un’esperienza competitiva e rigiocabile.",
        "status": "RUN // {_KEB(?)_RUN!}",
        "capabilities": [
          "Art Direction",
          "2D/3D Art"
        ],
        "platforms": [
          "Arcade"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Keb runs through the city",
          "it": "Keb attraversa la città"
        },
        "text": {
          "en": [
            "Players guide the mascot Keb through a dynamic urban environment.",
            "Prizes and power-ups push up the pace, while obstacles and random combinations make every round different."
          ],
          "it": [
            "Il giocatore guida la mascotte Keb attraverso un ambiente urbano dinamico.",
            "Premi e power-up aumentano il ritmo, mentre ostacoli e combinazioni casuali rendono ogni partita diversa."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/kebhouze/kebhouze-loop-1.mp4",
            "poster": "/case/kebhouze/kebhouze-cover-1.webp",
            "alt": {
              "it": "Kebhouze Gameplay",
              "en": "KebHouze gameplay"
            }
          },
          {
            "src": "/case/kebhouze/kebhouze-loop-2.mp4",
            "poster": "/case/kebhouze/kebhouze-cover-2.webp",
            "alt": {
              "it": "Kebhouze Gameplay",
              "en": "KebHouze gameplay"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "A round to share",
          "it": "Una partita da condividere"
        },
        "text": {
          "en": [
            "The cabinet supports both single player and multiplayer modes.",
            "Leaderboards and rewards turn a short session into a system that generates competition and replay value."
          ],
          "it": [
            "Il cabinato supporta modalità single player e multiplayer.",
            "Classifiche e ricompense trasformano una sessione breve in un sistema capace di generare confronto e rigiocabilità."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/kebhouze/kebhouze-multplayer.mp4",
            "poster": "/case/kebhouze/kebhouze-cover-3.webp",
            "alt": {
              "it": "Kebhouze Gameplay",
              "en": "KebHouze gameplay"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "From mascot to experience",
          "it": "Dalla Mascotte all'esperienza"
        },
        "text": {
          "en": [
            "Characters, environments and gameplay translate the KebHouze identity into a physical and digital product.",
            "The audience doesn't just meet the brand: they control it."
          ],
          "it": [
            "Personaggi, ambientazioni e gameplay traducono l’identità KebHouze in un prodotto fisico e digitale.",
            "Il pubblico non incontra soltanto il brand: lo controlla."
          ]
        }
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Concept Art",
          "it": "Concept Art"
        },
        "images": [
          {
            "src": "/case/kebhouze/kebhouze-env-1.webp",
            "alt": {
              "it": "Kebhouze Environment Concept",
              "en": "KebHouze environment concept"
            }
          },
          {
            "src": "/case/kebhouze/kebhouze-env-2.webp",
            "alt": {
              "it": "Kebhouze Environment Concept",
              "en": "KebHouze environment concept"
            }
          },
          {
            "src": "/case/kebhouze/kebhouze-env-3.webp",
            "alt": {
              "it": "Kebhouze Environment Concept",
              "en": "KebHouze environment concept"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/kebhouze/kebhouze-concept-1.webp",
            "alt": {
              "it": "Kebhouze Concept",
              "en": "KebHouze concept art"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/kebhouze/kebhouze-concept-2.webp",
            "alt": {
              "it": "Kebhouze Concept",
              "en": "KebHouze concept art"
            }
          },
          {
            "src": "/case/kebhouze/kebhouze-concept-3.webp",
            "alt": {
              "it": "Kebhouze Concept",
              "en": "KebHouze concept art"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "mulm",
    "code": "MSN_001",
    "year": "2023",
    "projectType": [
      "tourism experience",
      "cultural experience"
    ],
    "accent": "#feff00",
    "icon": "/case/mulm/mulm-icon.svg",
    "image": "/case/mulm/mulm-hero.webp",
    "seoTag": "Museum Experience",
    "customer": "Interreg",
    "partner": "",
    "copy": {
      "en": {
        "category": "Museum Experience / Interactive Itineraries / Digital Concierge",
        "title": "MULM",
        "excerpt": "An app connects museums, places and activities from the Gotthard to the Po Valley, turning the region into a scattered museum.",
        "intro": "MuLM — Museo più Lungo del Mondo is a mobile application developed within an Interreg project to promote places and museums across Ticino and Italy. A virtual hostess helps visitors choose stops and activities, while stories, a memory game and interactive itineraries deepen the content of each place. The app brings distant destinations together into a single, customisable visit.",
        "status": "WORLD IS IN YOUR HANDS // {_LET'S GO!}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D/3D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      },
      "it": {
        "category": "Museum Experience / Interactive Itineraries / Digital Concierge",
        "title": "MULM",
        "excerpt": "Un’app collega musei, luoghi e attività dal San Gottardo alla Pianura Padana, trasformando il territorio in un museo diffuso.",
        "intro": "MuLM — Museo più Lungo del Mondo è un’applicazione mobile sviluppata nell’ambito di un progetto Interreg per valorizzare luoghi e musei tra Ticino e Italia. Una hostess virtuale aiuta il visitatore a scegliere tappe e attività, mentre storie, Memory e itinerari interattivi approfondiscono i contenuti del territorio. L’app riunisce destinazioni distanti in un’unica esperienza di visita personalizzabile.",
        "status": "WORLD IS IN YOUR HANDS // {_LET'S GO!}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D/3D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "A virtual hostess travels with you",
          "it": "Una Hostess virtuale accompagna il viaggio"
        },
        "text": {
          "en": [
            "A digital guide suggests activities based on the user's interests.",
            "Every stop has its own content and visual identity, tied together by a story that follows a couple across the region."
          ],
          "it": [
            "Una guida digitale suggerisce attività in base agli interessi dell’utente.",
            "Ogni tappa possiede contenuti e identità visiva dedicati, collegati da una storia che segue una coppia attraverso il territorio."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/mulm/mulm-hostess-loop.mp4",
            "alt": {
              "it": "MULM Hostess",
              "en": "MuLM virtual hostess"
            }
          },
          {
            "src": "/case/mulm/mulm-intro.mp4",
            "alt": {
              "it": "MULM Intro Storia",
              "en": "MuLM story intro"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Poster illustrations for the different partners",
          "it": "Illustrazioni dei Poster per i diversi Partner"
        },
        "images": [
          {
            "src": "/case/mulm/mulm-poster-1.webp",
            "alt": {
              "it": "Poster Mulm",
              "en": "MuLM poster"
            }
          },
          {
            "src": "/case/mulm/mulm-poster-2.webp",
            "alt": {
              "it": "Poster Mulm",
              "en": "MuLM poster"
            }
          },
          {
            "src": "/case/mulm/mulm-poster-3.webp",
            "alt": {
              "it": "Poster Mulm",
              "en": "MuLM poster"
            }
          },
          {
            "src": "/case/mulm/mulm-poster-4.webp",
            "alt": {
              "it": "Poster Mulm",
              "en": "MuLM poster"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/mulm/mulm-poster-5.webp",
            "alt": {
              "it": "Poster Mulm",
              "en": "MuLM poster"
            }
          },
          {
            "src": "/case/mulm/mulm-poster-6.webp",
            "alt": {
              "it": "Poster Mulm",
              "en": "MuLM poster"
            }
          },
          {
            "src": "/case/mulm/mulm-poster-7.webp",
            "alt": {
              "it": "Poster Mulm",
              "en": "MuLM poster"
            }
          },
          {
            "src": "/case/mulm/mulm-poster-8.webp",
            "alt": {
              "it": "Poster Mulm",
              "en": "MuLM poster"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Every place hands us a piece of history",
          "it": "Ogni luogo ci porta alla scoperta di un pezzo di storia"
        },
        "text": {
          "en": "Every stop gives back a piece of history, letting users collect unique illustrations and stories.",
          "it": "Ogni tappa regala un pezzo di storia, permettendo all'utente di collezionare illustrazioni e racconti unici."
        }
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Illustrations for the different stories",
          "it": "Illustrazioni delle diverse storie"
        },
        "images": [
          {
            "src": "/case/mulm/mulm-ill-1.webp",
            "alt": {
              "it": "Illustrazioni Mulm",
              "en": "MuLM illustrations"
            }
          },
          {
            "src": "/case/mulm/mulm-ill-2.webp",
            "alt": {
              "it": "Illustrazioni Mulm",
              "en": "MuLM illustrations"
            }
          },
          {
            "src": "/case/mulm/mulm-ill-3.webp",
            "alt": {
              "it": "Illustrazioni Mulm",
              "en": "MuLM illustrations"
            }
          },
          {
            "src": "/case/mulm/mulm-ill-4.webp",
            "alt": {
              "it": "Illustrazioni Mulm",
              "en": "MuLM illustrations"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/mulm/mulm-ill-5.webp",
            "alt": {
              "it": "Illustrazioni Mulm",
              "en": "MuLM illustrations"
            }
          },
          {
            "src": "/case/mulm/mulm-ill-6.webp",
            "alt": {
              "it": "Illustrazioni Mulm",
              "en": "MuLM illustrations"
            }
          },
          {
            "src": "/case/mulm/mulm-ill-7.webp",
            "alt": {
              "it": "Illustrazioni Mulm",
              "en": "MuLM illustrations"
            }
          },
          {
            "src": "/case/mulm/mulm-ill-8.webp",
            "alt": {
              "it": "Illustrazioni Mulm",
              "en": "MuLM illustrations"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Learning by playing and walking",
          "it": "Conoscere giocando e camminando"
        },
        "text": {
          "en": [
            "A memory game introduces cultural facts in interactive form.",
            "Itineraries dedicated to Faido, Serravalle and Fondazione Pro San Gottardo connect digital content with the real visit."
          ],
          "it": [
            "Un Memory introduce curiosità culturali in forma interattiva.",
            "Itinerari dedicati a Faido, Serravalle e Fondazione Pro San Gottardo collegano contenuti digitali e visita reale."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/mulm/mulm-memory-loop.mp4",
            "poster": "/case/mulm/mulm-memory-cover.webp",
            "alt": {
              "it": "MULM Gioco del Memory",
              "en": "MuLM memory game"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "omicidio-sulla-centovallina",
    "code": "MSN_003",
    "year": "2024",
    "projectType": [
      "live experience",
      "games"
    ],
    "accent": "#7F3AEF",
    "icon": "/case/centovallina/centovallina-icon.svg",
    "image": "/case/centovallina/centovallina-hero.webp",
    "seoTag": "Live Mobile Game",
    "customer": "RSI, Ferrovia Vigezzina-Centovalli",
    "partner": "Elia Frapolli - Consulenza e Turismo",
    "copy": {
      "en": {
        "category": "Mobile Investigation / Live Actors / Real-time Ranking",
        "title": "Omicidio sulla Centovallina",
        "excerpt": "A mobile investigation crosses Locarno and the Centovallina, meets live actors and ends in a live grand final.",
        "intro": "Omicidio sulla Centovallina is an investigative treasure hunt created for RSI and the Vigezzina-Centovalli railway. More than 800 participants, split into teams, used an app to gather clues, consult case files and question actors met along the route. An online leaderboard selected the teams admitted to the live grand final, connecting mobile play, travel and show.",
        "status": "ELEMENTARY // {_WATSON}",
        "capabilities": [
          "Art Direction",
          "Storytelling",
          "Live Entertainment",
          "Gamification"
        ],
        "platforms": [
          "Live Event",
          "Mobile App"
        ]
      },
      "it": {
        "category": "Mobile Investigation / Live Actors / Real-time Ranking",
        "title": "Omicidio sulla Centovallina",
        "excerpt": "Un’indagine mobile attraversa Locarno e la Centovallina, incontra attori reali e termina con una finalissima dal vivo.",
        "intro": "Omicidio sulla Centovallina è una caccia al tesoro investigativa realizzata per RSI e Ferrovia Vigezzina-Centovalli. Più di 800 partecipanti, divisi in squadre, hanno usato un’app per raccogliere indizi, consultare dossier e interrogare attori incontrati lungo il territorio. Una classifica online ha selezionato le squadre ammesse alla finalissima dal vivo, collegando gioco mobile, viaggio e spettacolo.",
        "status": "ELEMENTARY // {_WATSON}",
        "capabilities": [
          "Art Direction",
          "Storytelling",
          "Live Entertainment",
          "Gamification"
        ],
        "platforms": [
          "Live Event",
          "Mobile App"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "A murder transforms the region",
          "it": "Un omicidio trasforma il territorio"
        },
        "text": {
          "en": [
            "Over 800 participants, split into teams, investigate the death of Giovanni Borromeo.",
            "Locarno and the Centovallina become the crime scene, with suspects and witnesses played by actors."
          ],
          "it": [
            "Oltre 800 partecipanti, divisi in squadre, indagano sulla morte di Giovanni Borromeo.",
            "Locarno e la Centovallina diventano la scena del crimine, con sospettati e testimoni interpretati da attori."
          ]
        }
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "Shots from the event",
          "it": "Scatti dell'evento"
        },
        "images": [
          {
            "src": "/case/centovallina/centovallina-foto-1.webp",
            "alt": {
              "it": "Foto evento Omicidio sulla Centovallina RSI",
              "en": "Photo from the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-foto-2.webp",
            "alt": {
              "it": "Foto evento Omicidio sulla Centovallina RSI",
              "en": "Photo from the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-foto-3.webp",
            "alt": {
              "it": "Foto evento Omicidio sulla Centovallina RSI",
              "en": "Photo from the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-foto-4.webp",
            "alt": {
              "it": "Foto evento Omicidio sulla Centovallina RSI",
              "en": "Photo from the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-foto-5.webp",
            "alt": {
              "it": "Foto evento Omicidio sulla Centovallina RSI",
              "en": "Photo from the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-foto-6.webp",
            "alt": {
              "it": "Foto evento Omicidio sulla Centovallina RSI",
              "en": "Photo from the RSI Omicidio sulla Centovallina event"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Clues, case files and interrogations",
          "it": "Indizi, dossier e interrogatori"
        },
        "text": {
          "en": [
            "The app guides the teams, helps them find the characters and gathers the elements of the investigation.",
            "Digital puzzles and real encounters build a single investigative experience."
          ],
          "it": [
            "L’applicazione guida le squadre, permette di individuare i personaggi e raccoglie gli elementi dell’indagine.",
            "Enigmi digitali e incontri reali costruiscono un’unica esperienza investigativa."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/centovallina/centovallina-foto-7.webp",
            "alt": {
              "it": "Foto sospettato Omicidio sulla Centovallina",
              "en": "Suspect from Omicidio sulla Centovallina"
            }
          }
        ]
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/centovallina/centovallina-video-1.mp4",
            "alt": {
              "it": "Applicazione Omicidio sulla Centovallina",
              "en": "Omicidio sulla Centovallina app"
            }
          },
          {
            "src": "/case/centovallina/centovallina-video-2.mp4",
            "alt": {
              "it": "Applicazione Omicidio sulla Centovallina",
              "en": "Omicidio sulla Centovallina app"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "From smartphone to stage",
          "it": "Dallo smartphone al palco"
        },
        "text": {
          "en": [
            "An online leaderboard selects the two best teams.",
            "The final challenge takes place live in the FART depot in Locarno Sant'Antonio, turning the mobile game into television entertainment."
          ],
          "it": [
            "Una classifica online seleziona le due squadre migliori.",
            "La sfida finale si svolge dal vivo nella rimessa FART di Locarno Sant’Antonio e trasforma il gioco mobile in intrattenimento televisivo."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/centovallina/centovallina-foto-8.webp",
            "alt": {
              "it": "Foto squadra vincente omicidio sulla centovallina",
              "en": "Winning team of Omicidio sulla Centovallina"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "Storyboard of the televised game show",
          "it": "Storyboard del gioco a premi televisivo"
        },
        "images": [
          {
            "src": "/case/centovallina/centovallina-storyboard-1.webp",
            "alt": {
              "it": "Storyboard evento Omicidio sulla Centovallina RSI",
              "en": "Storyboard for the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-storyboard-2.webp",
            "alt": {
              "it": "Storyboard evento Omicidio sulla Centovallina RSI",
              "en": "Storyboard for the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-storyboard-3.webp",
            "alt": {
              "it": "Storyboard evento Omicidio sulla Centovallina RSI",
              "en": "Storyboard for the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-storyboard-4.webp",
            "alt": {
              "it": "Storyboard evento Omicidio sulla Centovallina RSI",
              "en": "Storyboard for the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-storyboard-5.webp",
            "alt": {
              "it": "Storyboard evento Omicidio sulla Centovallina RSI",
              "en": "Storyboard for the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-storyboard-6.webp",
            "alt": {
              "it": "Storyboard evento Omicidio sulla Centovallina RSI",
              "en": "Storyboard for the RSI Omicidio sulla Centovallina event"
            }
          },
          {
            "src": "/case/centovallina/centovallina-storyboard-7.webp",
            "alt": {
              "it": "Storyboard evento Omicidio sulla Centovallina RSI",
              "en": "Storyboard for the RSI Omicidio sulla Centovallina event"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "top-networker",
    "code": "MSN_003",
    "year": "2024",
    "projectType": "live experience",
    "accent": "#7F3AEF",
    "icon": "/case/topnetworker/topnetworker-icon.svg",
    "image": "/case/topnetworker/topnetworker-hero.webp",
    "seoTag": "Live Experience",
    "customer": "Business Matching",
    "partner": "",
    "copy": {
      "en": {
        "category": "Physical Cards / People Matching / Live Scoring",
        "title": "Top Networker",
        "excerpt": "Physical cards, personal QR codes and a live leaderboard turn professional networking into a measurable system of encounters.",
        "intro": "Top Networker is a gamification experience designed for Business Matching 2024. Participants use physical cards to find the person holding the same image and collect stickers by visiting the exhibitors' stands. A personal QR code links these activities to a digital scoring system and to a leaderboard updated in real time across the two days of the event.",
        "status": "YOU + US = MATCH // {_CONTACT_US!}",
        "capabilities": [
          "Art Direction",
          "Event Experience",
          "Live Entertainment",
          "Gamification"
        ],
        "platforms": [
          "Live Event",
          "Web App"
        ]
      },
      "it": {
        "category": "Physical Cards / People Matching / Live Scoring",
        "title": "Top Networker",
        "excerpt": "Carte fisiche, QR personali e una classifica live trasformano il networking professionale in un sistema di incontri misurabile.",
        "intro": "Top Networker è un’esperienza di gamification progettata per Business Matching 2024. I partecipanti usano carte fisiche per trovare persone con la stessa immagine e raccolgono bollini visitando gli stand degli espositori. Un QR personale collega queste attività a un sistema digitale di punteggio e a una classifica aggiornata in tempo reale durante le due giornate dell’evento.",
        "status": "YOU + US = MATCH // {_CONTACT_US!}",
        "capabilities": [
          "Art Direction",
          "Event Experience",
          "Live Entertainment",
          "Gamification"
        ],
        "platforms": [
          "Live Event",
          "Web App"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Find the person with the same card",
          "it": "Trovare la persona con la stessa carta"
        },
        "text": {
          "en": [
            "Every participant receives an image and looks through the event for whoever holds the matching one.",
            "The pair validates the encounter at the MACACO stand, earns points and starts again with a new card."
          ],
          "it": [
            "Ogni partecipante riceve un’immagine e cerca nell’evento chi possiede il match corrispondente.",
            "La coppia convalida l’incontro allo stand MACACO, ottiene punti e riparte con una nuova carta."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/topnetworker/topnetworker-foto-1.webp",
            "alt": {
              "it": "Foto match al business matching 2024",
              "en": "Card match at Business Matching 2024"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "A design built on the metaphor of space travel",
          "it": "Un design che usa la metafora dei viaggi spaziali"
        },
        "images": [
          {
            "src": "/case/topnetworker/topnetworker-card-1.webp",
            "alt": {
              "it": "Carte del Business Matching 2024",
              "en": "Business Matching 2024 cards"
            }
          },
          {
            "src": "/case/topnetworker/topnetworker-card-2.webp",
            "alt": {
              "it": "Carte del Business Matching 2024",
              "en": "Business Matching 2024 cards"
            }
          },
          {
            "src": "/case/topnetworker/topnetworker-card-3.webp",
            "alt": {
              "it": "Carte del Business Matching 2024",
              "en": "Business Matching 2024 cards"
            }
          },
          {
            "src": "/case/topnetworker/topnetworker-card-4.webp",
            "alt": {
              "it": "Carte del Business Matching 2024",
              "en": "Business Matching 2024 cards"
            }
          },
          {
            "src": "/case/topnetworker/topnetworker-card-5.webp",
            "alt": {
              "it": "Carte del Business Matching 2024",
              "en": "Business Matching 2024 cards"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Bringing people to the stands",
          "it": "Portare le persone agli Stand"
        },
        "text": {
          "en": [
            "A second card collects the stickers earned by taking part in the exhibitors' activities.",
            "The system rewards both the connections between people and the exploration of the fair."
          ],
          "it": [
            "Una seconda carta raccoglie bollini ottenuti partecipando alle attività degli espositori.",
            "Il sistema premia sia le connessioni tra persone sia l’esplorazione dell’area fieristica."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/topnetworker/topnetworker-foto-2.webp",
            "alt": {
              "it": "Foto match con Stand al business matching 2024",
              "en": "Card match at an exhibitor stand, Business Matching 2024"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Networking becomes visible",
          "it": "Il Networking diventa visibile"
        },
        "text": {
          "en": [
            "A personal QR code opens the leaderboard, updated in real time.",
            "The competition runs across both days and rewards the three participants with the highest scores."
          ],
          "it": [
            "Un QR personale apre la classifica aggiornata in tempo reale.",
            "La competizione attraversa le due giornate e premia i tre partecipanti con il punteggio più alto."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/topnetworker/topnetworker-foto-3.webp",
            "alt": {
              "it": "Foto QR al business matching 2024",
              "en": "Personal QR code at Business Matching 2024"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "neko-music-video",
    "code": "MSN_003",
    "year": "2024",
    "projectType": "content production",
    "accent": "#7F3AEF",
    "icon": "/case/neko/neko-icon.svg",
    "image": "/case/neko/neko-hero.webp",
    "seoTag": "Music Video",
    "customer": "Neko",
    "partner": "",
    "copy": {
      "en": {
        "category": "Music-driven storytelling / Music Video",
        "title": "Neko Music Video",
        "excerpt": "An artist rebuilt in 3D moves through dreamlike, sci-fi worlds, produced entirely inside a real-time game engine.",
        "intro": "Neko Music Video brings the artist’s music into dreamlike, science-fiction worlds through art direction and 3D storytelling. A faithful digital version of the artist moves through environments built around the tracks. The videos are produced in Unity 3D, bringing character, environments, lighting and effects into a single real-time production process.",
        "status": "HEADBANGING STARTED // {_NECKPAIN?}",
        "capabilities": [
          "Art Direction",
          "3D Art",
          "Unity 3D"
        ],
        "platforms": [
          "Video"
        ]
      },
      "it": {
        "category": "Music-driven storytelling / Music Video",
        "title": "Neko Music Video",
        "excerpt": "Un artista ricostruito in 3D attraversa mondi onirici e fantascientifici, prodotti interamente in un game engine real-time.",
        "intro": "Neko Music Video porta la musica dell’artista in mondi onirici e fantascientifici attraverso art direction e storytelling 3D. Una versione digitale fedele dell’artista attraversa ambienti costruiti in relazione ai brani. I videoclip sono prodotti in Unity 3D, unendo personaggio, ambienti, luci ed effetti in un unico processo di produzione real-time.",
        "status": "HEADBANGING STARTED // {_NECKPAIN?}",
        "capabilities": [
          "Art Direction",
          "3D Art",
          "Unity 3D"
        ],
        "platforms": [
          "Video"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Bringing the artist into a virtual world",
          "it": "Portare l'artista in un mondo virtuale"
        },
        "text": {
          "en": [
            "A faithful 3D model of the artist was created for the project.",
            "The digital character becomes the centre of a succession of environments impossible to build physically."
          ],
          "it": [
            "Per il progetto è stato creato un modello 3D fedele dell’artista.",
            "Il personaggio digitale diventa il centro di una successione di ambienti impossibili da costruire fisicamente."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/neko/neko-loop-1.mp4",
            "poster": "/case/neko/neko-cover-1.webp",
            "alt": {
              "it": "Video Musicale Neko",
              "en": "Neko music video"
            }
          },
          {
            "src": "/case/neko/neko-loop-2.mp4",
            "poster": "/case/neko/neko-cover-2.webp",
            "alt": {
              "it": "Video Musicale Neko",
              "en": "Neko music video"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "The music changes the space",
          "it": "La musica cambia lo spazio"
        },
        "text": {
          "en": [
            "Movements, actions and transitions are built around the rhythm and mood of the track.",
            "Lighting, animation and composition turn the performance into a visual story."
          ],
          "it": [
            "Movimenti, azioni e transizioni sono costruiti in relazione al ritmo e all’atmosfera del brano.",
            "Luci, animazioni e composizione trasformano la performance in un racconto visivo."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/neko/neko-loop-3.mp4",
            "poster": "/case/neko/neko-cover-3.webp",
            "alt": {
              "it": "Video Musicale Neko",
              "en": "Neko music video"
            }
          },
          {
            "src": "/case/neko/neko-loop-4.mp4",
            "poster": "/case/neko/neko-cover-4.webp",
            "alt": {
              "it": "Video Musicale Neko",
              "en": "Neko music video"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "A single production environment",
          "it": "Un solo ambiente di produzione"
        },
        "text": {
          "en": [
            "Unity brings characters, sets, animation and effects together in one real-time space.",
            "The project applies the language and tools of video games to music content production."
          ],
          "it": [
            "Unity riunisce personaggi, scenari, animazioni ed effetti in uno spazio real-time.",
            "Il progetto applica linguaggi e strumenti del videogioco alla produzione di contenuti musicali."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/neko/neko-loop-5.mp4",
            "alt": {
              "it": "MULM Hostess",
              "en": "MuLM virtual hostess"
            }
          },
          {
            "src": "/case/neko/neko-loop-6.mp4",
            "alt": {
              "it": "MULM Intro Storia",
              "en": "MuLM story intro"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "tesori-delle-vette-del-ceresio",
    "code": "MSN_001",
    "year": "2024",
    "projectType": [
      "tourism experience",
      "cultural experience"
    ],
    "accent": "#7FFFFF",
    "icon": "/case/vette/vette-icon.svg",
    "image": "/case/vette/vette-hero.webp",
    "seoTag": "Tourism Experience",
    "customer": "ERSL, Lugano Region, ERSMB, Mendrisiotto Turismo",
    "partner": "",
    "copy": {
      "en": {
        "category": "Real Life Adventure / Unique Stories / Interactive Concierge",
        "title": "Tesori delle vette del Ceresio",
        "excerpt": "Six mountains, six missions and a time machine connect the peaks of the Ceresio into a single mobile experience.",
        "intro": "Tesori delle Vette del Ceresio is a mobile app for families that connects Monte Tamaro, Monte Lema, Monte Brè, Monte San Salvatore, Monte Generoso and Monte San Giorgio. Visitors have to recover six gems by taking on a mission built around real features of each mountain. A shared story ties the destinations together, while characters, puzzles and illustrations change to reflect the identity of every peak.",
        "status": "TIME MACHINE BROKEN // {_TIME_HAS_GONE_NUTS!}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D/3D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      },
      "it": {
        "category": "Real Life Adventure / Unique Stories / Interactive Concierge",
        "title": "Tesori delle vette del Ceresio",
        "excerpt": "Sei montagne, sei missioni e una macchina del tempo collegano le vette del Ceresio in un’unica esperienza mobile.",
        "intro": "Tesori delle Vette del Ceresio è un’app mobile per famiglie che collega Monte Tamaro, Monte Lema, Monte Brè, Monte San Salvatore, Monte Generoso e Monte San Giorgio. I visitatori devono recuperare sei gemme affrontando su ogni montagna una missione costruita attorno a elementi reali del luogo. Una storia comune unisce le destinazioni, mentre personaggi, enigmi e illustrazioni cambiano per rappresentare l’identità di ciascuna vetta.",
        "status": "TIME MACHINE BROKEN // {_TIME_HAS_GONE_NUTS!}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D/3D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Six gems have vanished",
          "it": "Sei gemme sono scomparse"
        },
        "text": {
          "en": [
            "The time machine can't work: the gems are scattered across the six mountains of the Ceresio.",
            "Every peak offers a different mission, led by characters created for that place."
          ],
          "it": [
            "La macchina del tempo non può funzionare: le gemme sono distribuite sulle sei montagne del Ceresio.",
            "Ogni vetta propone una missione diversa, guidata da personaggi creati per il luogo."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/vette/vette-intro.mp4",
            "alt": {
              "it": "Intro storia Tesori Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio story intro"
            }
          },
          {
            "src": "/case/vette/vette-machine.mp4",
            "alt": {
              "it": "Macchina del tempo Tesori Vette del Ceresio",
              "en": "Time machine in Tesori delle Vette del Ceresio"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Every mountain has its own story",
          "it": "Ogni montagna ha la propria storia"
        },
        "text": {
          "en": [
            "Meteorology, lightning, the Middle Ages and palaeontology become the themes of dedicated stories and activities.",
            "Illustrations, characters, gems and puzzles translate the cultural and natural features of each destination."
          ],
          "it": [
            "Meteorologia, fulmini, Medioevo e paleontologia diventano temi di storie e attività dedicate.",
            "Illustrazioni, personaggi, gemme ed enigmi traducono le caratteristiche culturali e naturali di ciascuna destinazione."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/vette/vette-story-loop-1.mp4",
            "poster": "/case/vette/vette-cover-story-1.webp",
            "alt": {
              "it": "Video storia delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio story video"
            }
          },
          {
            "src": "/case/vette/vette-story-loop-2.mp4",
            "poster": "/case/vette/vette-cover-story-2.webp",
            "alt": {
              "it": "Video storia delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio story video"
            }
          },
          {
            "src": "/case/vette/vette-story-loop-3.mp4",
            "poster": "/case/vette/vette-cover-story-3.webp",
            "alt": {
              "it": "Video storia delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio story video"
            }
          },
          {
            "src": "/case/vette/vette-story-loop-4.mp4",
            "poster": "/case/vette/vette-cover-story-4.webp",
            "alt": {
              "it": "Video storia delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio story video"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Illustrations for the different stories",
          "it": "Illustrazioni delle diverse storie"
        },
        "images": [
          {
            "src": "/case/vette/vette-ill-1.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-2.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-3.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/vette/vette-ill-4.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-11.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-12.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "Every mountain has a look of its own",
          "it": "Ogni montagna ha un suo aspetto"
        },
        "images": [
          {
            "src": "/case/vette/vette-ill-5.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-6.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-7.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-8.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-9.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          },
          {
            "src": "/case/vette/vette-ill-10.webp",
            "alt": {
              "it": "Illustrazioni Tesori delle Vette del Ceresio",
              "en": "Tesori delle Vette del Ceresio illustrations"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Real-world elements enter the game",
          "it": "Gli elementi reali entrano nel gioco"
        },
        "text": {
          "en": [
            "The missions use details, places and attractions found on the peaks.",
            "The app encourages families to visit more destinations and to connect them through a shared story."
          ],
          "it": [
            "Le missioni utilizzano dettagli, luoghi e attrazioni presenti sulle vette.",
            "L’app incentiva le famiglie a visitare più destinazioni e a collegarle attraverso una storia comune."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/vette/vette-real-element.webp",
            "alt": {
              "it": "Enigma Monte Brè Tesori delle Vette del Ceresio",
              "en": "Monte Brè puzzle in Tesori delle Vette del Ceresio"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "tesori-della-valle-di-blenio",
    "code": "MSN_001",
    "year": "2020-2023",
    "projectType": [
      "tourism experience",
      "games",
      "cultural experience"
    ],
    "accent": "#A9FF00",
    "icon": "/case/blenio/blenio-icon.svg",
    "image": "/case/blenio/blenio-hero.webp",
    "seoTag": "Tourism Experience",
    "customer": "FASV - Valle di Blenio",
    "partner": "Elia Frapolli - Consulenza e Turismo",
    "copy": {
      "en": {
        "category": "Real Life Adventure / Animated Stories / Physical Coins",
        "title": "Tesori della valle di Blenio",
        "excerpt": "A family treasure hunt that connects mobile navigation, animated illustrations and coins hidden across the Blenio Valley.",
        "intro": "Tesori della Valle di Blenio is a mobile app that turns a visit to the valley into a family treasure hunt. The phone provides the map, rhyming clues and a compass, while children use a paper map to find and rub the coins placed at key spots. Every find unlocks illustrated stories and information about the place.",
        "status": "SEARCH IN PROGRESS // {_WHERE_ARE_THE_COINS?}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      },
      "it": {
        "category": "Real Life Adventure / Animated Stories / Physical Coins",
        "title": "Tesori della valle di Blenio",
        "excerpt": "Una caccia al tesoro per famiglie collega navigazione mobile, illustrazioni animate e monete nascoste nella Valle di Blenio.",
        "intro": "I Tesori della Valle di Blenio è un’app mobile che trasforma la visita della Valle in una caccia al tesoro per famiglie. Il telefono fornisce mappa, indizi in rima e bussola, mentre i bambini usano una mappa cartacea per cercare e ricalcare monete collocate in punti strategici. Ogni ritrovamento sblocca storie illustrate e informazioni sul luogo visitato.",
        "status": "SEARCH IN PROGRESS // {_WHERE_ARE_THE_COINS?}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "The valley becomes a map to explore",
          "it": "La valle diventa una mappa da esplorare"
        },
        "text": {
          "en": [
            "A story introduces the mission and opens the navigator with the different treasures.",
            "Nursery rhymes and a compass guide families once they reach the right area."
          ],
          "it": [
            "Una storia introduce la missione e apre il navigatore con i diversi tesori.",
            "Filastrocche e bussola guidano le famiglie quando raggiungono la zona corretta."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/blenio/blenio-gameplay-1.mp4",
            "alt": {
              "it": "Gameplay Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio gameplay"
            }
          },
          {
            "src": "/case/blenio/blenio-gameplay-2.mp4",
            "alt": {
              "it": "Gameplay Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio gameplay"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Every find opens a story",
          "it": "Ogni ritrovamento apre una storia"
        },
        "text": {
          "en": [
            "Completing a search unlocks illustrated, animated insights into the area.",
            "Real animals and features of the valley are reinterpreted in a cartoon language."
          ],
          "it": [
            "Completare una ricerca sblocca approfondimenti illustrati e animati sul territorio.",
            "Animali e caratteristiche reali della Valle vengono reinterpretati con un linguaggio cartoonesco."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/blenio/blenio-intro-1.mp4",
            "alt": {
              "it": "Gameplay Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio gameplay"
            }
          },
          {
            "src": "/case/blenio/blenio-photo-mode.mp4",
            "alt": {
              "it": "Gameplay Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio gameplay"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "images": [
          {
            "src": "/case/blenio/blenio-ill-1.webp",
            "alt": {
              "it": "Illustrazioni Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio illustrations"
            }
          },
          {
            "src": "/case/blenio/blenio-ill-2.webp",
            "alt": {
              "it": "Illustrazioni Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio illustrations"
            }
          },
          {
            "src": "/case/blenio/blenio-ill-3.webp",
            "alt": {
              "it": "Illustrazioni Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio illustrations"
            }
          },
          {
            "src": "/case/blenio/blenio-ill-4.webp",
            "alt": {
              "it": "Illustrazioni Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio illustrations"
            }
          },
          {
            "src": "/case/blenio/blenio-ill-5.webp",
            "alt": {
              "it": "Illustrazioni Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio illustrations"
            }
          },
          {
            "src": "/case/blenio/blenio-ill-6.webp",
            "alt": {
              "it": "Illustrazioni Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio illustrations"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Preparatory sketches by the art director",
          "it": "Schizzi preparatori da parte dell'Art Director"
        },
        "images": [
          {
            "src": "/case/blenio/blenio-ill-7.webp",
            "alt": {
              "it": "Illustrazioni Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio illustrations"
            }
          },
          {
            "src": "/case/blenio/blenio-ill-8.webp",
            "alt": {
              "it": "Illustrazioni Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio illustrations"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "A coin to find and to trace",
          "it": "Una moneta da trovare e ricalcare"
        },
        "text": {
          "en": [
            "The paper map lets children take part without using a smartphone.",
            "The physical coins sit close to local businesses, and their shape can be traced into the spaces provided."
          ],
          "it": [
            "La mappa cartacea permette ai bambini di partecipare senza utilizzare lo smartphone.",
            "Le monete fisiche sono posizionate vicino a realtà locali e la loro forma può essere ricalcata negli spazi dedicati."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/blenio/blenio-coin-2.webp",
            "alt": {
              "it": "Monete dei Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio coins"
            }
          },
          {
            "src": "/case/blenio/blenio-coin-1.webp",
            "alt": {
              "it": "Monete dei Tesori della Valle di Blenio",
              "en": "Tesori della Valle di Blenio coins"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "tesori-di-brissago",
    "code": "MSN_001",
    "year": "2022",
    "projectType": [
      "tourism experience",
      "games",
      "cultural experience"
    ],
    "accent": "#A9FF00",
    "icon": "/case/brissago/brissago-icon.svg",
    "image": "/case/brissago/brissago-hero.webp",
    "seoTag": "Tourism Experience",
    "customer": "Comune di Brissago",
    "partner": "Elia Frapolli - Consulenza e Turismo",
    "copy": {
      "en": {
        "category": "Real Life Adventure / Animated Stories / Physical Coins",
        "title": "Tesori di Brissago",
        "excerpt": "An app and a paper map turn Brissago into a treasure hunt of clues, compass bearings and real doubloons.",
        "intro": "Tesori di Brissago is a mobile app for families developed for the Municipality of Brissago. A digital map, rhyming clues and a compass guide players towards physical treasures placed near local landmarks and businesses. Children can follow a paper map at the same time and collect real doubloons, linking exploration on the ground to digital content.",
        "status": "YO! HO! // {_A_PIRATE_LIFE_S_FOR_ME}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      },
      "it": {
        "category": "Real Life Adventure / Animated Stories / Physical Coins",
        "title": "Tesori di Brissago",
        "excerpt": "Un’app e una mappa cartacea trasformano Brissago in una caccia al tesoro tra indizi, bussola e dobloni reali.",
        "intro": "I Tesori di Brissago è un’app mobile per famiglie sviluppata per il Comune di Brissago. Una mappa digitale, filastrocche e bussola guidano i partecipanti verso tesori fisici collocati vicino a luoghi e attività locali. I bambini possono seguire contemporaneamente una mappa cartacea e raccogliere veri dobloni, collegando esplorazione sul territorio e contenuti digitali.",
        "status": "YO! HO! // {_A_PIRATE_LIFE_S_FOR_ME}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "The mission starts on screen",
          "it": "La missione inizia sullo schermo"
        },
        "text": {
          "en": [
            "A story introduces the hunt and leads to a map of the treasures to reach.",
            "As the family gets close to a spot, a rhyme delivers the clue and the compass completes the search."
          ],
          "it": [
            "Una storia introduce la ricerca e conduce a una mappa con i tesori da raggiungere.",
            "Quando la famiglia si avvicina a un punto, una filastrocca fornisce l’indizio e la bussola completa la ricerca."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/brissago/brissago-gameplay-1.mp4",
            "alt": {
              "it": "Gameplay Tesori di Brissago",
              "en": "Tesori di Brissago gameplay"
            }
          },
          {
            "src": "/case/brissago/brissago-gameplay-2.mp4",
            "alt": {
              "it": "Gameplay Tesori di Brissago",
              "en": "Tesori di Brissago gameplay"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "The doubloons are real",
          "it": "I dobloni esistono davvero"
        },
        "text": {
          "en": [
            "Children follow a paper map while the adults use the app.",
            "The treasures sit near historic shops, museums, cafés and meaningful places, so the hunt becomes a real discovery of the area."
          ],
          "it": [
            "I bambini seguono una mappa cartacea mentre gli adulti utilizzano l’app.",
            "I tesori sono collocati vicino a negozi storici, musei, locali e luoghi significativi per attivare una scoperta reale del territorio."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/brissago/brissago-coin-2.webp",
            "alt": {
              "it": "Monete Tesori di Brissago",
              "en": "Tesori di Brissago coins"
            }
          },
          {
            "src": "/case/brissago/brissago-coin-1.webp",
            "alt": {
              "it": "Monete Tesori di Brissago",
              "en": "Tesori di Brissago coins"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "A geometric, contemporary Middle Ages",
          "it": "Un medioevo geometrico e contemporaneo"
        },
        "text": {
          "en": [
            "Knights, pirates and antique ornaments are reinterpreted in a style that works for the youngest players.",
            "The format born in the Blenio Valley changes identity to belong visually to Brissago."
          ],
          "it": [
            "Cavalieri, pirati e decorazioni antiche vengono reinterpretati attraverso uno stile accessibile ai più piccoli.",
            "Il format nato in Valle di Blenio cambia identità per appartenere visivamente a Brissago."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/brissago/brissago-ill-video-1.mp4",
            "poster": "/case/brissago/brissago-video-cover-1.webp",
            "alt": {
              "it": "Video storia dei Tesori di Brissago",
              "en": "Tesori di Brissago story video"
            }
          },
          {
            "src": "/case/brissago/brissago-ill-video-2.mp4",
            "poster": "/case/brissago/brissago-video-cover-2.webp",
            "alt": {
              "it": "Video storia dei Tesori di Brissago",
              "en": "Tesori di Brissago story video"
            }
          },
          {
            "src": "/case/brissago/brissago-ill-video-3.mp4",
            "poster": "/case/brissago/brissago-video-cover-3.webp",
            "alt": {
              "it": "Video storia dei Tesori di Brissago",
              "en": "Tesori di Brissago story video"
            }
          }
        ]
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/brissago/brissago-ill-video-4.mp4",
            "poster": "/case/brissago/brissago-video-cover-4.webp",
            "alt": {
              "it": "Video storia dei Tesori di Brissago",
              "en": "Tesori di Brissago story video"
            }
          },
          {
            "src": "/case/brissago/brissago-ill-video-5.mp4",
            "poster": "/case/brissago/brissago-video-cover-5.webp",
            "alt": {
              "it": "Video storia dei Tesori di Brissago",
              "en": "Tesori di Brissago story video"
            }
          },
          {
            "src": "/case/brissago/brissago-ill-video-6.mp4",
            "poster": "/case/brissago/brissago-video-cover-6.webp",
            "alt": {
              "it": "Video storia dei Tesori di Brissago",
              "en": "Tesori di Brissago story video"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/brissago/brissago-ill-1.webp",
            "alt": {
              "it": "Illustrazioni Tesori di Brissago",
              "en": "Tesori di Brissago illustrations"
            }
          },
          {
            "src": "/case/brissago/brissago-ill-2.webp",
            "alt": {
              "it": "Illustrazioni Tesori di Brissago",
              "en": "Tesori di Brissago illustrations"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "segreti-del-lago",
    "code": "MSN_001",
    "year": "2023",
    "projectType": [
      "tourism experience",
      "cultural experience"
    ],
    "accent": "#7FFFFF",
    "icon": "/case/segretilago/segretilago-icon.svg",
    "image": "/case/segretilago/segretilago-hero.webp",
    "seoTag": "Digital Concierge",
    "customer": "Comune di Brissago",
    "partner": "",
    "copy": {
      "en": {
        "category": "Digital Concierge / Relaxing Mini-Games / Territory Content",
        "title": "I Segreti del Lago",
        "excerpt": "A digital concierge concept for discovering Brissago and Ronco sopra Ascona before, during and beyond the visit.",
        "intro": "I Segreti del Lago is an analysis and concept project presented to the Municipality of Brissago for a future tourism app covering Brissago and Ronco sopra Ascona. The proposed solution brings information, activities and personalised suggestions together into a digital concierge for visitors and residents. Minigames, storytelling and a distinct illustrated identity are there to spark discovery of the area even before the trip.",
        "status": "ONCE UPON A TIME // {_MAYBE_NOT?}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      },
      "it": {
        "category": "Digital Concierge / Relaxing Mini-Games / Territory Content",
        "title": "I Segreti del Lago",
        "excerpt": "Un concept di concierge digitale per scoprire Brissago e Ronco Sopra Ascona prima, durante e oltre la visita.",
        "intro": "I Segreti del Lago è un progetto di analisi e concept presentato al Comune di Brissago per una futura app turistica dedicata a Brissago e Ronco Sopra Ascona. La soluzione immaginata riunisce informazioni, attività e suggerimenti personalizzati in un concierge digitale per visitatori e residenti. Minigiochi, narrazione e una specifica identità illustrata servono a stimolare la scoperta del territorio anche prima della visita.",
        "status": "ONCE UPON A TIME // {_MAYBE_NOT?}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Gamification"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Beyond the information app",
          "it": "Oltre l'app informativa"
        },
        "text": {
          "en": [
            "The concept gathers local opportunities, news and activities into an app for tourists, residents and holidaymakers.",
            "An introductory narrative accompanies users and suggests experiences based on their interests."
          ],
          "it": [
            "Il concept riunisce opportunità, novità e attività del territorio in un’app per turisti, residenti e villeggianti.",
            "Una narrativa introduttiva accompagna l’utente e suggerisce esperienze in base ai suoi interessi."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/segretilago/segretilago-home-loop.mp4",
            "alt": {
              "it": "Home Loop Segreti del Lago",
              "en": "Segreti del Lago home screen loop"
            }
          },
          {
            "src": "/case/segretilago/segreti-lago-duke-loop.mp4",
            "alt": {
              "it": "Game Loop Segreti del Lago",
              "en": "Segreti del Lago game loop"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Discovering the secrets before you arrive",
          "it": "Scoprire i segreti prima di arrivare"
        },
        "text": {
          "en": [
            "Small relaxing games introduce curiosities about the Brissago area.",
            "Gamification keeps the relationship with the place alive and brings part of the trip forward, digitally."
          ],
          "it": [
            "Piccoli giochi rilassanti introducono curiosità legate al Brissaghese.",
            "La gamification mantiene attivo il rapporto con il luogo e anticipa digitalmente parte dell’esperienza turistica."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/segretilago/segreti-lago-search-gameplay.mp4",
            "alt": {
              "it": "Gameplay Loop Segreti del Lago",
              "en": "Segreti del Lago gameplay loop"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Making an idea visible",
          "it": "Rendere visibile un'idea"
        },
        "text": {
          "en": [
            "Illustration, animation, hand drawing and digital art define possible visual and narrative directions.",
            "The prototype makes it possible to grasp the mood and the workings of a product still at concept stage."
          ],
          "it": [
            "Illustrazioni, animazioni, disegno a mano e arte digitale definiscono possibili direzioni visive e narrative.",
            "Il prototipo consente di comprendere atmosfera e funzionamento di un prodotto ancora in fase concettuale."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/segretilago/segretilago-video-concept.mp4",
            "poster": "/case/segretilago/segretilago-ill-4.webp",
            "alt": {
              "it": "Video storia dei Tesori di Brissago",
              "en": "Tesori di Brissago story video"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "images": [
          {
            "src": "/case/segretilago/segretilago-ill-1.webp",
            "alt": {
              "it": "Illustrazioni Segreti del Lago",
              "en": "Segreti del Lago illustrations"
            }
          },
          {
            "src": "/case/segretilago/segretilago-ill-2.webp",
            "alt": {
              "it": "Illustrazioni Segreti del Lago",
              "en": "Segreti del Lago illustrations"
            }
          },
          {
            "src": "/case/segretilago/segretilago-ill-3.webp",
            "alt": {
              "it": "Illustrazioni Segreti del Lago",
              "en": "Segreti del Lago illustrations"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "forest-jump",
    "code": "MSN_003",
    "year": "2019",
    "projectType": "games",
    "accent": "#A9FF00",
    "icon": "/case/forestjump/forestjump-icon.svg",
    "image": "/case/forestjump/forestjump-hero.webp",
    "seoTag": "Arcade Game",
    "customer": "Eyebags Studio Srl",
    "partner": "",
    "copy": {
      "en": {
        "category": "Character Design / Arcade Game / Art Direction",
        "title": "Forest Jump",
        "excerpt": "A visual identity built from the character to the cabinet, giving an arcade game a coherent digital and physical presence.",
        "intro": "Forest Jump is an arcade cabinet game made by EyeBags Studio Srl. Studio MACACO developed its art direction: main character, environments, props, branding and the aesthetic design of the physical machine. The work creates continuity between what appears on screen and the object the audience interacts with.",
        "status": "FLOOR IS // {_LITERALLY_LAVA?}",
        "capabilities": [
          "Art Direction",
          "2D/3D Art"
        ],
        "platforms": [
          "Arcade"
        ]
      },
      "it": {
        "category": "Character Design / Arcade Game / Art Direction",
        "title": "Forest Jump",
        "excerpt": "Un’identità visiva costruita dal personaggio al cabinato, per dare a un arcade game una presenza digitale e fisica coerente.",
        "intro": "Forest Jump è un arcade game per cabinato realizzato da EyeBags Studio Srl. Studio MACACO ne ha sviluppato la direzione artistica: personaggio principale, ambientazioni, props, branding e design estetico della macchina fisica. Il lavoro crea continuità tra ciò che appare sullo schermo e l’oggetto con cui il pubblico interagisce.",
        "status": "FLOOR IS // {_LITERALLY_LAVA?}",
        "capabilities": [
          "Art Direction",
          "2D/3D Art"
        ],
        "platforms": [
          "Arcade"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Giving the forest a shape",
          "it": "Dare forma alla foresta"
        },
        "text": {
          "en": [
            "Studio MACACO defined the graphic universe of Forest Jump starting from the concepts for the setting and the main character.",
            "Props and visual elements build a world that stays recognisable on every screen."
          ],
          "it": [
            "Studio MACACO ha definito l’universo grafico di Forest Jump a partire dai concept dell’ambientazione e del personaggio principale.",
            "Props ed elementi visivi costruiscono un mondo riconoscibile in ogni schermata."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/forestjump/forestjump-ill-1.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          },
          {
            "src": "/case/forestjump/forestjump-ill-2.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          },
          {
            "src": "/case/forestjump/forestjump-ill-3.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Early alternative concept art",
          "it": "Early Alternative Concept Art"
        },
        "images": [
          {
            "src": "/case/forestjump/forestjump-ill-8.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          },
          {
            "src": "/case/forestjump/forestjump-ill-9.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "The game continues off screen",
          "it": "Il gioco continua fuori dallo schermo"
        },
        "text": {
          "en": [
            "The cabinet design carries the colours, shapes and rhythm of the game into the physical object.",
            "The arcade machine becomes part of the project's identity and stage presence."
          ],
          "it": [
            "Il design del cabinato porta colori, forme e ritmo del gioco nell’oggetto fisico.",
            "La macchina arcade diventa parte dell’identità e della presenza scenica del progetto."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/forestjump/forestjump-ill-6.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "A coordinated identity",
          "it": "Un'identità coordinata"
        },
        "text": {
          "en": [
            "Branding, characters, environments and interface were designed as parts of the same system.",
            "Art direction ties digital production and physical product together."
          ],
          "it": [
            "Branding, personaggi, ambienti e interfaccia sono stati progettati come parti dello stesso sistema.",
            "La direzione artistica collega produzione digitale e prodotto fisico."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/forestjump/forestjump-ill-4.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          },
          {
            "src": "/case/forestjump/forestjump-ill-5.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Game logo",
          "it": "Game Logo"
        },
        "images": [
          {
            "src": "/case/forestjump/forestjump-ill-7.webp",
            "alt": {
              "it": "Forest Jump Environment Concept",
              "en": "Forest Jump environment concept"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "playstorming",
    "code": "MSN_003",
    "year": "ongoing",
    "projectType": "digital products",
    "accent": "#7F3AEF",
    "icon": "/case/playstorming/playstorming-icon.svg",
    "image": "/case/playstorming/playstorming-hero.webp",
    "seoTag": "Gamified Platform",
    "customer": "Elma Research Srl",
    "partner": "",
    "copy": {
      "en": {
        "category": "Digital Product / Multiplayer / Data Collection / Gamification",
        "title": "Playstorming",
        "excerpt": "A multiplayer platform turns qualitative research into a session that is participatory, configurable and measurable.",
        "intro": "Playstorming is an online multiplayer platform developed for Elma Research to run qualitative research and team building activities. A moderator puts forward questions, drawings, votes and exercises through two modes, PharmaRace and GameFlow. The platform manages teams and leaderboards, collects the answers and organises the data into reports available from a dashboard.",
        "status": "ROLL // {_THE_DICE!}",
        "capabilities": [
          "Real-Time Development",
          "Backend Development",
          "Art Direction",
          "2D/3D Art",
          "Unity 3D"
        ],
        "platforms": [
          "Web"
        ]
      },
      "it": {
        "category": "Digital Product / Multiplayer / Data Collection / Gamification",
        "title": "Playstorming",
        "excerpt": "Una piattaforma multiplayer trasforma la ricerca qualitativa in una sessione partecipata, configurabile e misurabile.",
        "intro": "Playstorming è una piattaforma multiplayer online sviluppata per Elma Research per condurre ricerche qualitative e attività di team building. Un moderatore propone domande, disegni, votazioni ed esercizi attraverso due modalità, PharmaRace e GameFlow. La piattaforma gestisce squadre e classifiche, raccoglie le risposte e organizza i dati in report consultabili da una dashboard.",
        "status": "ROLL // {_THE_DICE!}",
        "capabilities": [
          "Real-Time Development",
          "Backend Development",
          "Art Direction",
          "2D/3D Art",
          "Unity 3D"
        ],
        "platforms": [
          "Web"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Research becomes participation",
          "it": "La ricerca diventa partecipazione"
        },
        "text": {
          "en": [
            "Playstorming splits participants into teams and triggers questions, drawings, choices and collaborative activities.",
            "The moderator runs the session while the system collects the data produced."
          ],
          "it": [
            "Playstorming divide i partecipanti in squadre e attiva domande, disegni, scelte e attività collaborative.",
            "Il moderatore governa la sessione mentre il sistema raccoglie i dati prodotti."
          ]
        }
      },
      {
        "type": "videoGrid",
        "label": {
          "en": "The moderator's view",
          "it": "Visione del moderatore"
        },
        "videos": [
          {
            "src": "/case/playstorming/playstorming-game-1.mp4",
            "poster": "/case/playstorming/playstorming-cover-1.webp",
            "alt": {
              "it": "Video Gameplay Moderatore Playstorming",
              "en": "Playstorming moderator gameplay video"
            }
          },
          {
            "src": "/case/playstorming/playstorming-wordcloud.mp4",
            "poster": "/case/playstorming/playstorming-cover-2.webp",
            "alt": {
              "it": "Video Gameplay Wordcloud Playstorming",
              "en": "Playstorming word cloud gameplay video"
            }
          }
        ]
      },
      {
        "type": "deviceShowcase",
        "label": {
          "en": "The participant's view",
          "it": "Visione dell'utente"
        },
        "devices": [
          {
            "src": "/case/playstorming/playstorming-user.mp4",
            "alt": {
              "it": "Video Gameplay Utente Playstorming",
              "en": "Playstorming participant gameplay video"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "PharmaRace or GameFlow",
          "it": "PharmaRace o GameFlow"
        },
        "text": {
          "en": [
            "PharmaRace uses a board and a digital die to pace the activities.",
            "GameFlow drops the fixed route and lets the moderator choose the order of the content freely."
          ],
          "it": [
            "PharmaRace usa un tabellone e un dado digitale per scandire le attività.",
            "GameFlow elimina il percorso obbligato e permette al moderatore di scegliere liberamente l’ordine dei contenuti."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/playstorming/playstorming-pharmarace.webp",
            "alt": {
              "it": "Modalità Pharmarace Playstorming",
              "en": "Playstorming PharmaRace mode"
            }
          },
          {
            "src": "/case/playstorming/playstorming-gameflow.webp",
            "alt": {
              "it": "Modalità Gameflow Playstorming",
              "en": "Playstorming GameFlow mode"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Configure, collect, analyse",
          "it": "Configurare, raccogliere, analizzare"
        },
        "text": {
          "en": [
            "A dashboard lets Elma Research build sessions, define content and manage the games.",
            "Real-time leaderboards and final reports support qualitative research, competition and team building."
          ],
          "it": [
            "Una dashboard permette a Elma Research di costruire sessioni, definire contenuti e gestire le partite.",
            "Classifiche in tempo reale e report finali supportano ricerca qualitativa, competizione e team building."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/playstorming/playstorming-multple.mp4",
            "poster": "/case/playstorming/playstorming-cover-3.webp",
            "alt": {
              "it": "Video Gameplay Risposta Multipla Playstorming",
              "en": "Playstorming multiple choice gameplay video"
            }
          },
          {
            "src": "/case/playstorming/playstorming-open.mp4",
            "poster": "/case/playstorming/playstorming-cover-4.webp",
            "alt": {
              "it": "Video Gameplay Risposta Aperta Playstorming",
              "en": "Playstorming open answer gameplay video"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "vivi-gambarogno",
    "code": "MSN_001",
    "year": "2026",
    "projectType": "digital products",
    "accent": "#7FFFFF",
    "icon": "/case/vivigambarogno/gambarogno-icon.svg",
    "image": "/case/vivigambarogno/gambarogno-hero.webp",
    "seoTag": "Digital Concierge",
    "customer": "Comune del Gambarogno",
    "partner": "Elia Frapolli - Consulenza e Turismo",
    "copy": {
      "en": {
        "category": "Digital Concierge / Content Dashboard",
        "title": "Vivi Gambarogno",
        "excerpt": "A mobile concierge brings together places, itineraries, activities and events; a dashboard lets the municipality keep them all up to date.",
        "intro": "Vivi Gambarogno is a mobile app developed for the Municipality of Gambarogno as a digital guide for residents and tourists. A filterable map collects places, events, experiences and itineraries that can also be downloaded for offline use; a mode dedicated to GambarognoArte 2026 lets visitors scan the artworks and earn badges. The municipality updates all the content itself through a web dashboard connected to the app.",
        "status": "NOTHING TO DO? // {_EXPLORE!}",
        "capabilities": [
          "Mobile App",
          "Unity 3D",
          "Backend Development"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      },
      "it": {
        "category": "Digital Concierge / Content Dashboard",
        "title": "Vivi Gambarogno",
        "excerpt": "Un concierge mobile riunisce luoghi, itinerari, attività ed eventi; una dashboard permette al Comune di mantenerli sempre aggiornati.",
        "intro": "Vivi Gambarogno è un’app mobile sviluppata per il Comune di Gambarogno come guida digitale per residenti e turisti. Una mappa con filtri raccoglie luoghi, eventi, esperienze e itinerari scaricabili anche offline; una modalità dedicata a GambarognoArte 2026 permette di scansionare le opere e ottenere badge. Il Comune aggiorna autonomamente tutti i contenuti attraverso una dashboard web collegata all’app.",
        "status": "NOTHING TO DO? // {_EXPLORE!}",
        "capabilities": [
          "Mobile App",
          "Unity 3D",
          "Backend Development"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "All of Gambarogno in one place",
          "it": "Tutto il Gambarogno in un solo spazio"
        },
        "text": {
          "en": [
            "An interactive map gathers points of interest, experiences, activities and events.",
            "Advanced filters help residents and visitors find what matters for their interests, the moment and the season."
          ],
          "it": [
            "Una mappa interattiva raccoglie punti d’interesse, esperienze, attività ed eventi.",
            "Filtri avanzati aiutano residenti e visitatori a trovare ciò che è rilevante per interessi, momento e stagione."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/vivigambarogno/gambarogno-map.mp4",
            "alt": {
              "it": "Mappa interattiva Vivi Gambarogno",
              "en": "Vivi Gambarogno interactive map"
            }
          },
          {
            "src": "/case/vivigambarogno/gambarogno-suggerimenti.mp4",
            "alt": {
              "it": "Suggerimenti Vivi Gambarogno",
              "en": "Vivi Gambarogno suggestions"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Itineraries available offline too",
          "it": "Itinerari disponibili anche offline"
        },
        "text": {
          "en": [
            "Walking routes can be downloaded and followed from start to finish.",
            "The app stays with the visit even when there is no connection available."
          ],
          "it": [
            "I percorsi pedestri possono essere scaricati e seguiti dall’inizio alla fine.",
            "L’app accompagna la visita anche quando la connessione non è disponibile."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/vivigambarogno/gambarogno-scheda-itinerario.mp4",
            "alt": {
              "it": "Itinerario Interattivo Vivi Gambarogno",
              "en": "Vivi Gambarogno interactive itinerary"
            }
          },
          {
            "src": "/case/vivigambarogno/gambarogno-itinerario.mp4",
            "alt": {
              "it": "Itinerario Interattivo Vivi Gambarogno",
              "en": "Vivi Gambarogno interactive itinerary"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "From the exhibition to the dashboard",
          "it": "Dalla mostra alla dashboard"
        },
        "text": {
          "en": [
            "For GambarognoArte 2026, scanning the QR codes on the artworks unlocks content, badges and prizes.",
            "A web dashboard lets the municipality update places, events, itineraries and information on its own."
          ],
          "it": [
            "Per GambarognoArte 2026, la scansione dei QR delle opere sblocca contenuti, badge e premi.",
            "Una dashboard web consente al Comune di aggiornare autonomamente luoghi, eventi, itinerari e informazioni."
          ]
        }
      },
      {
        "type": "deviceShowcase",
        "devices": [
          {
            "src": "/case/vivigambarogno/gambarogno-arte.mp4",
            "alt": {
              "it": "GambarognoArte",
              "en": "GambarognoArte"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "la-selva",
    "code": "MSN_003",
    "year": "2021-2022",
    "projectType": "digital products",
    "accent": "#7F3AEF",
    "icon": "/case/laselva/laselva-icon.svg",
    "image": "/case/laselva/laselva-hero.webp",
    "seoTag": "Immersive Story",
    "customer": "Studio Volpi Srl",
    "partner": "",
    "copy": {
      "en": {
        "category": "Immersive Story / Data Platform",
        "title": "La Selva",
        "excerpt": "A narrative VR assessment that observes how people decide when advantages, risks and values pull against each other.",
        "intro": "La Selva is a PC and virtual reality software designed as an assessment tool for HR teams and decision makers. Along a path inspired by the Divine Comedy, users choose between roads, advantages and compromises that reveal how they approach problems and decisions. The answers are gathered into a platform to produce feedback on soft skills and observed behaviour.",
        "status": "NEL MEZZO DEL CAMMIN // {_LO_SAI_IL_RESTO?}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "3D Art",
          "Data Collection"
        ],
        "platforms": [
          "PC, Virtual Reality"
        ]
      },
      "it": {
        "category": "Immersive Story / Data Platform",
        "title": "La Selva",
        "excerpt": "Un assessment narrativo in VR che osserva come le persone decidono quando vantaggi, rischi e valori entrano in conflitto.",
        "intro": "La Selva è un software per PC e Realtà Virtuale progettato come strumento di assessment per HR e decision maker. In un percorso ispirato alla Divina Commedia, l’utente sceglie tra strade, vantaggi e compromessi che fanno emergere il suo modo di affrontare problemi e decisioni. Le risposte vengono raccolte in una piattaforma per produrre un riscontro sulle soft skill e sul comportamento osservato.",
        "status": "NEL MEZZO DEL CAMMIN // {_LO_SAI_IL_RESTO?}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "3D Art",
          "Data Collection"
        ],
        "platforms": [
          "PC, Virtual Reality"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Entering the wood with a goal",
          "it": "Entrare nella selva con un obiettivo"
        },
        "text": {
          "en": [
            "Users choose a reward and are carried into an environment inspired by the Divine Comedy.",
            "The three beasts offer immediate advantages. Virgil proposes a harder path, with no bonuses."
          ],
          "it": [
            "L’utente sceglie una ricompensa e viene trasportato in un ambiente ispirato alla Divina Commedia.",
            "Le tre fiere offrono vantaggi immediati. Virgilio propone un percorso più difficile, senza bonus."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/laselva/laselva-obscure-forest.mp4",
            "poster": "/case/laselva/laselva-video-cover-1.webp",
            "alt": {
              "it": "La Selva Foresta Oscura",
              "en": "La Selva dark forest"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "The answer isn't all that counts",
          "it": "Non conta solo la risposta"
        },
        "text": {
          "en": [
            "Each path presents different questions and situations.",
            "The system observes how a person handles difficulty, compromise and opportunity, bringing soft-skill traits to the surface."
          ],
          "it": [
            "Ogni percorso presenta domande e situazioni differenti.",
            "Il sistema osserva come la persona affronta difficoltà, compromessi e opportunità, facendo emergere elementi legati alle soft skill."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/laselva/laselva-wolf.mp4",
            "poster": "/case/laselva/laselva-video-cover-3.webp",
            "alt": {
              "it": "La Selva Lupo",
              "en": "La Selva wolf"
            }
          },
          {
            "src": "/case/laselva/laselva-lynx.mp4",
            "poster": "/case/laselva/laselva-video-cover-6.webp",
            "alt": {
              "it": "La Selva Lince",
              "en": "La Selva lynx"
            }
          },
          {
            "src": "/case/laselva/laselva-lion.mp4",
            "poster": "/case/laselva/laselva-video-cover-2.webp",
            "alt": {
              "it": "La Selva Leone",
              "en": "La Selva lion"
            }
          },
          {
            "src": "/case/laselva/laselva-paradise.mp4",
            "poster": "/case/laselva/laselva-video-cover-5.webp",
            "alt": {
              "it": "La Selva Paradiso",
              "en": "La Selva paradise"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "From experience to profile",
          "it": "Dall'esperienza al profilo"
        },
        "text": {
          "en": [
            "At the end, users receive feedback on the behaviour they adopted.",
            "Answers and decisions are saved and sent to a platform dedicated to collecting and analysing the data."
          ],
          "it": [
            "Al termine, l’utente riceve un riscontro sul comportamento adottato.",
            "Risposte e decisioni vengono salvate e inviate a una piattaforma dedicata alla raccolta e all’analisi dei dati."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/laselva/laselva-lynx-end.mp4",
            "poster": "/case/laselva/laselva-video-cover-4.webp",
            "alt": {
              "it": "La Selva Lince Finale",
              "en": "La Selva lynx ending"
            }
          },
          {
            "src": "/case/laselva/laselva-virgilio.mp4",
            "poster": "/case/laselva/laselva-video-cover-7.webp",
            "alt": {
              "it": "La Selva Virgilio Finale",
              "en": "La Selva Virgil ending"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Level design and lighting to set the mood",
          "it": "Level Design e luci per creare il mood perfetto"
        },
        "text": {
          "en": [
            "Every world is shaped by the feelings it has to convey.",
            "Lights, models and framing are never accidental, but carefully designed."
          ],
          "it": [
            "Ogni mondo è ispirato alle sensazioni che deve trasmettere.",
            "Luci, modelli, inquadrature non sono a caso, ma accuratamente studiate."
          ]
        }
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Level design of the different worlds",
          "it": "Level Design dei diversi mondi"
        },
        "images": [
          {
            "src": "/case/laselva/laselva-engine-1.webp",
            "alt": {
              "it": "La Selva Sviluppo",
              "en": "La Selva development"
            }
          },
          {
            "src": "/case/laselva/laselva-engine-2.webp",
            "alt": {
              "it": "La Selva Sviluppo",
              "en": "La Selva development"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "every-dei-at-work",
    "code": "MSN_003",
    "year": "2024",
    "projectType": [
      "storytelling",
      "digital products"
    ],
    "accent": "#7FFFFF",
    "icon": "/case/everyday/everyday-icon.svg",
    "image": "/case/everyday/everyday-hero.webp",
    "seoTag": "Learning Platform",
    "customer": "",
    "partner": "",
    "copy": {
      "en": {
        "category": "Learning Path / Certification / Reporting System",
        "title": "Every DEI at work",
        "excerpt": "A platform that turns DEI training, certifications and reports into a single measurable digital path.",
        "intro": "Every Day at Work is the concept for a corporate platform dedicated to Diversity, Equity & Inclusion training. Employees and collaborators follow learning paths, complete activities and earn trackable certificates. The same system includes a space for reporting problematic behaviour so that the people responsible can take it in hand.",
        "status": "SIGNAL LOCK // {_ENTER?}",
        "capabilities": [
          "Art Direction",
          "2D/3D Art",
          "Animation"
        ],
        "platforms": [
          "Concept Design"
        ]
      },
      "it": {
        "category": "Learning Path / Certification / Reporting System",
        "title": "Every DEI at work",
        "excerpt": "Una piattaforma per trasformare formazione DEI, certificazioni e segnalazioni in un unico percorso digitale misurabile.",
        "intro": "Every Day at Work è il concept di una piattaforma aziendale dedicata alla formazione su Diversity, Equity & Inclusion. Dipendenti e collaboratori seguono percorsi educativi, completano attività e ottengono certificati tracciabili. Lo stesso sistema include uno spazio per segnalare comportamenti problematici e consentirne la presa in carico da parte delle figure responsabili.",
        "status": "SIGNAL LOCK // {_ENTER?}",
        "capabilities": [
          "Art Direction",
          "2D/3D Art",
          "Animation"
        ],
        "platforms": [
          "Concept Design"
        ]
      }
    },
    "sections": [
      {
        "type": "videoPlayer",
        "label": {
          "en": "Product presentation video",
          "it": "Video presentazione prodotto"
        },
        "video": {
          "src": "/case/everyday/everyday-video.mp4",
          "poster": "/case/everyday/everyday-video-cover.webp",
          "playIcon": "/general/play-icon.svg",
          "ariaLabel": {
            "it": "Video presentazione prodotto",
            "en": "Product presentation video"
          },
          "preload": "metadata"
        }
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Training that continues over time",
          "it": "Formazione che prosegue nel tempo"
        },
        "text": {
          "en": [
            "The platform organises content and learning paths on diversity, equity, inclusion and behaviour at work.",
            "Everyone can follow the activities and learn how to recognise inappropriate or discriminatory situations."
          ],
          "it": [
            "La piattaforma organizza contenuti e percorsi dedicati a diversità, equità, inclusione e comportamenti sul lavoro.",
            "Ogni persona può seguire le attività e comprendere come riconoscere situazioni inappropriate o discriminatorie."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/everyday/everyday-dashboard.webp",
            "alt": {
              "it": "Dashboard Every Day at Work",
              "en": "Every Day at Work dashboard"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Visible goals, trackable paths",
          "it": "Obiettivi visibili, percorsi tracciabili"
        },
        "text": {
          "en": [
            "The system monitors the completion of activities and issues certificates once the goals are reached.",
            "That lets the organisation make the training it has delivered verifiable."
          ],
          "it": [
            "Il sistema monitora il completamento delle attività e rilascia certificati al raggiungimento degli obiettivi.",
            "L’organizzazione può così rendere verificabile il percorso formativo svolto."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/everyday/everyday-formative-path.webp",
            "alt": {
              "it": "Dashboard Every Day at Work",
              "en": "Every Day at Work dashboard"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "A structured space for reports",
          "it": "Uno spazio strutturato per le segnalazioni"
        },
        "text": {
          "en": [
            "A dedicated function makes it possible to report problematic incidents and behaviour.",
            "The people responsible can take them on inside the same system."
          ],
          "it": [
            "Una funzione dedicata consente di riportare episodi e comportamenti problematici.",
            "Le figure responsabili possono prenderli in carico all’interno dello stesso sistema."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/everyday/everyday-formative-path-2.webp",
            "alt": {
              "it": "Dashboard Every Day at Work",
              "en": "Every Day at Work dashboard"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "cube-up",
    "code": "MSN_001",
    "year": "2017",
    "projectType": "games",
    "accent": "#feff00",
    "icon": "/case/cubeup/cubeup-icon.svg",
    "image": "/case/cubeup/cubeup-hero.webp",
    "seoTag": "Mobile Game",
    "customer": "Indie Collaboration",
    "partner": "",
    "copy": {
      "en": {
        "category": "Mobile Game / Music Driven Visual / Unlockable Avatars",
        "title": "Cube Up",
        "excerpt": "A cube to complete against the clock. Every level shifts rhythm, colour and mood to follow a new music track.",
        "intro": "Cube Up is a casual game for smartphones released on Android and iOS in 2017. Players have to complete a cube as fast as they can, across levels whose visual style changes with the music. Missions and unlockable avatars add progression to a fast mechanic built for mobile sessions.",
        "status": "UP WE GO // {_BUT_WHY?}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "2D Art",
          "Unity 3D"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      },
      "it": {
        "category": "Mobile Game / Music Driven Visual / Unlockable Avatars",
        "title": "Cube Up",
        "excerpt": "Un cubo da completare contro il tempo. Ogni livello cambia ritmo, colore e atmosfera seguendo una nuova traccia musicale.",
        "intro": "Cube Up è un casual game per smartphone pubblicato su Android e iOS nel 2017. Il giocatore deve completare un cubo nel minor tempo possibile, affrontando livelli il cui stile visivo cambia in base alla musica. Missioni e avatar sbloccabili aggiungono progressione a una meccanica rapida costruita per sessioni mobile.",
        "status": "UP WE GO // {_BUT_WHY?}",
        "capabilities": [
          "Mobile App",
          "Art Direction",
          "2D Art",
          "Unity 3D"
        ],
        "platforms": [
          "Android",
          "iOS"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Complete the cube before time runs out",
          "it": "Completare il cubo prima del tempo"
        },
        "text": {
          "en": [
            "Cube Up builds a mobile casual game around one immediate mechanic: completing a cube as fast as possible.",
            "The simplicity of the gesture puts rhythm and precision at the centre of the experience."
          ],
          "it": [
            "Cube Up costruisce un casual game mobile attorno a una meccanica immediata: completare un cubo nel minor tempo possibile.",
            "La semplicità del gesto rende il ritmo e la precisione il centro dell’esperienza."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/cubeup/cubeup-vapor.mp4",
            "poster": "/case/cubeup/cubeup-video-cover-1.webp",
            "alt": {
              "it": "Gameplay Cube Up",
              "en": "Cube Up gameplay"
            }
          },
          {
            "src": "/case/cubeup/cubeup-pixel.mp4",
            "poster": "/case/cubeup/cubeup-video-cover-2.webp",
            "alt": {
              "it": "Gameplay Cube Up",
              "en": "Cube Up gameplay"
            }
          },
          {
            "src": "/case/cubeup/cubeup-boost.mp4",
            "poster": "/case/cubeup/cubeup-video-cover-3.webp",
            "alt": {
              "it": "Gameplay Cube Up",
              "en": "Cube Up gameplay"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Every song creates a world",
          "it": "Ogni canzone genera un mondo"
        },
        "text": {
          "en": [
            "Pop, rock, retro and hip hop drive the colours, effects and identity of the levels.",
            "The music doesn't just accompany the game: it organises its visual language."
          ],
          "it": [
            "Pop, rock, retrò e hip hop determinano colori, effetti e identità dei livelli.",
            "La musica non accompagna soltanto il gioco: ne organizza il linguaggio visivo."
          ]
        }
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Concept art for the skins, by music genre",
          "it": "Concept Art delle skin in base al genere musicale"
        },
        "images": [
          {
            "src": "/case/cubeup/cubeup-style-1.webp",
            "alt": {
              "it": "Stili di gioco di Cube Up",
              "en": "Cube Up visual styles"
            }
          },
          {
            "src": "/case/cubeup/cubeup-style-2.webp",
            "alt": {
              "it": "Stili di gioco di Cube Up",
              "en": "Cube Up visual styles"
            }
          },
          {
            "src": "/case/cubeup/cubeup-style-3.webp",
            "alt": {
              "it": "Stili di gioco di Cube Up",
              "en": "Cube Up visual styles"
            }
          },
          {
            "src": "/case/cubeup/cubeup-style-4.webp",
            "alt": {
              "it": "Stili di gioco di Cube Up",
              "en": "Cube Up visual styles"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "New faces, new goals",
          "it": "Nuovi volti, nuovi obiettivi"
        },
        "text": {
          "en": [
            "Avatars that can be bought or unlocked through missions extend progression beyond the score.",
            "The project was released for Android and iOS in 2017."
          ],
          "it": [
            "Avatar acquistabili o sbloccabili attraverso missioni estendono la progressione oltre il punteggio.",
            "Il progetto è stato pubblicato per Android e iOS nel 2017."
          ]
        }
      }
    ]
  },
  {
    "slug": "respect",
    "code": "MSN_001",
    "year": "2021",
    "projectType": [
      "games for impact",
      "games"
    ],
    "accent": "#7F3AEF",
    "icon": "/case/respect/respect-icon.svg",
    "image": "/case/respect/respect-hero.webp",
    "seoTag": "VR Serious Game",
    "customer": "",
    "partner": "",
    "copy": {
      "en": {
        "category": "VR Story / Serious Game / Storytelling",
        "title": "Respect",
        "excerpt": "A VR story deliberately limits the player's choices to force them to see the impact of their own actions.",
        "intro": "Respect — For who I truly am is a virtual reality serious game about raising awareness of bullying. Players interact with a student, but the system deliberately narrows the available replies until it leads them into offensive behaviour. The experience then confronts them with the consequences of their actions, using discomfort as an educational tool.",
        "status": "RESPECT // {_FOR_ANYONE}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "Storytelling",
          "3D Art",
          "2D Art",
          "Unreal Engine",
          "Gamification"
        ],
        "platforms": [
          "Virtual Reality"
        ]
      },
      "it": {
        "category": "VR Story / Serious Game / Storytelling",
        "title": "Respect",
        "excerpt": "Una storia VR limita volutamente le scelte del giocatore per costringerlo a osservare l’impatto delle proprie azioni.",
        "intro": "Respect — For who I truly am è un serious game in Realtà Virtuale dedicato alla sensibilizzazione sul bullismo. Il giocatore interagisce con una studentessa, ma il sistema restringe volutamente le risposte fino a condurlo verso comportamenti offensivi. L’esperienza lo mette poi di fronte alle conseguenze delle proprie azioni, usando il disagio come strumento educativo.",
        "status": "RESPECT // {_FOR_ANYONE}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "Storytelling",
          "3D Art",
          "2D Art",
          "Unreal Engine",
          "Gamification"
        ],
        "platforms": [
          "Virtual Reality"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Ending up on the wrong side",
          "it": "Entrare nella parte sbagliata"
        },
        "text": {
          "en": [
            "Players meet a student who tries to share the things she loves.",
            "The available replies are progressively narrowed, pushing them to mock and belittle her."
          ],
          "it": [
            "Il giocatore incontra una studentessa che prova a condividere le proprie passioni.",
            "Le possibilità di risposta vengono progressivamente limitate, spingendolo a deriderla e denigrarla."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/respect/respect-intro-1.mp4",
            "poster": "/case/respect/respect-video-cover-1.webp",
            "alt": {
              "it": "Respect introduzione storia",
              "en": "Respect story introduction"
            }
          },
          {
            "src": "/case/respect/respect-intro-2.mp4",
            "poster": "/case/respect/respect-video-cover-2.webp",
            "alt": {
              "it": "Respect interazione",
              "en": "Respect interaction"
            }
          }
        ]
      },
      {
        "type": "videoPlayer",
        "label": {
          "en": "Virtual reality gameplay video",
          "it": "Video Gameplay Realtà Virtuale"
        },
        "video": {
          "src": "/case/respect/respect-gameplay.mp4",
          "poster": "/case/respect/respect-gameplay-cover.webp",
          "playIcon": "/general/play-icon.svg",
          "ariaLabel": {
            "it": "Video Gameplay Realtà Virtuale",
            "en": "Virtual reality gameplay video"
          },
          "preload": "metadata"
        }
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Seeing the effect of your own words",
          "it": "Vedere l'effetto delle proprie parole"
        },
        "text": {
          "en": [
            "The restriction isn't a limit of the game, it's the heart of the project.",
            "By putting players in an uncomfortable position, the experience makes visible the weight of behaviour often dismissed as harmless."
          ],
          "it": [
            "La restrizione non è un limite del gioco, ma il centro del progetto.",
            "Mettendo il giocatore in una posizione scomoda, l’esperienza rende visibile il peso di comportamenti spesso considerati innocui."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/respect/respect-distorsion.mp4",
            "poster": "/case/respect/respect-video-cover-3.webp",
            "alt": {
              "it": "Respect Distorsione pareti",
              "en": "Respect wall distortion"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Concept art for the different passion walls",
          "it": "Concept Art delle diverse pareti delle passioni"
        },
        "images": [
          {
            "src": "/case/respect/respect-ill-2.webp",
            "alt": {
              "it": "Concept Art Respect",
              "en": "Respect concept art"
            }
          },
          {
            "src": "/case/respect/respect-ill-3.webp",
            "alt": {
              "it": "Concept Art Respect",
              "en": "Respect concept art"
            }
          },
          {
            "src": "/case/respect/respect-ill-4.webp",
            "alt": {
              "it": "Concept Art Respect",
              "en": "Respect concept art"
            }
          },
          {
            "src": "/case/respect/respect-ill-5.webp",
            "alt": {
              "it": "Concept Art Respect",
              "en": "Respect concept art"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/respect/respect-ill-1.webp",
            "alt": {
              "it": "Concept Art Respect",
              "en": "Respect concept art"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "VR as a space for confrontation",
          "it": "La VR come spazio di confronto"
        },
        "text": {
          "en": [
            "Respect uses immersion and interaction to address bullying from a first-person perspective.",
            "The ending brings users face to face with what they did and with its consequences."
          ],
          "it": [
            "Respect utilizza immedesimazione e interazione per affrontare il bullismo da una prospettiva diretta.",
            "La conclusione porta l’utente a confrontarsi con ciò che ha fatto e con le sue conseguenze."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/respect/respect-final-1.mp4",
            "poster": "/case/respect/respect-video-cover-4.webp",
            "alt": {
              "it": "Respect Finale",
              "en": "Respect ending"
            }
          },
          {
            "src": "/case/respect/respect-final-2.mp4",
            "poster": "/case/respect/respect-video-cover-5.webp",
            "alt": {
              "it": "Respect Finale",
              "en": "Respect ending"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "im-fading",
    "code": "MSN_001",
    "year": "2021",
    "projectType": [
      "games for impact",
      "games"
    ],
    "accent": "#7F3AEF",
    "icon": "/case/imfading/imfading-icon.svg",
    "image": "/case/imfading/imfading-hero.webp",
    "seoTag": "Serious Game",
    "customer": "",
    "partner": "",
    "copy": {
      "en": {
        "category": "Serious Game / Storytelling / Memory Training",
        "title": "I'm Fading",
        "excerpt": "Rebuilding a sequence of photographs to understand what losing a memory means, and how to stay close to someone living with Alzheimer's.",
        "intro": "I'm Fading is a demo serious game designed to raise awareness among the families of people with Alzheimer's. Players rebuild a grandmother's memories by putting photographs in order and gradually come to understand the difficulties shown in her daily life. An additional mode lets families create new sequences from personal images, as a support for memory and conversation.",
        "status": "MEMORIES // {_LET_S_KEEP_THEM}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "PC"
        ]
      },
      "it": {
        "category": "Serious Game / Storytelling / Memory Training",
        "title": "I'm Fading",
        "excerpt": "Ricostruire una sequenza di fotografie per comprendere cosa significa perdere un ricordo e come restare vicini a chi vive con l’Alzheimer.",
        "intro": "I’m Fading è un serious game dimostrativo pensato per sensibilizzare i familiari delle persone con Alzheimer. Il giocatore ricostruisce i ricordi di una nonna ordinando fotografie e comprende progressivamente le difficoltà mostrate nella vita quotidiana. Una modalità aggiuntiva permette alle famiglie di creare nuove sequenze usando immagini personali come supporto alla memoria e al dialogo.",
        "status": "MEMORIES // {_LET_S_KEEP_THEM}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D",
          "Gamification"
        ],
        "platforms": [
          "PC"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "When an everyday gesture is no longer simple",
          "it": "Quando un gesto quotidiano non è più semplice"
        },
        "text": {
          "en": [
            "A young woman reads her grandmother's inability to choose an ice cream as frustrating.",
            "At home she finds photographs scattered around a white halo: putting them back together means stepping into her grandmother's memory."
          ],
          "it": [
            "Una ragazza interpreta con frustrazione l’incapacità della nonna di scegliere un gelato.",
            "A casa scopre fotografie sparse attorno a un alone bianco: ricomporle significa entrare nella memoria della nonna."
          ]
        }
      },
      {
        "type": "imageGrid",
        "images": [
          {
            "src": "/case/imfading/imfading-intro-1.webp",
            "alt": {
              "it": "Intro storia I'm Fading",
              "en": "I'm Fading story intro"
            }
          },
          {
            "src": "/case/imfading/imfading-intro-2.webp",
            "alt": {
              "it": "Intro storia I'm Fading",
              "en": "I'm Fading story intro"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Putting the images back in place",
          "it": "Rimettere le immagini al loro posto"
        },
        "text": {
          "en": [
            "Players look at the photographs, rebuild their order and watch the whole story again.",
            "The mechanic makes the difficulty of organising and retrieving memories tangible."
          ],
          "it": [
            "Il giocatore osserva le fotografie, ne ricostruisce l’ordine e rivede la storia completa.",
            "La meccanica rende concreta la difficoltà di organizzare e recuperare i ricordi."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/imfading/imfading-gameplay-1.mp4",
            "poster": "/case/imfading/imfading-video-cover-1.webp",
            "alt": {
              "it": "I'm Fading Video di Gioco",
              "en": "I'm Fading gameplay video"
            }
          },
          {
            "src": "/case/imfading/imfading-gameplay-2.mp4",
            "poster": "/case/imfading/imfading-video-cover-2.webp",
            "alt": {
              "it": "I'm Fading Video di Gioco",
              "en": "I'm Fading gameplay video"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Building a story from your own photos",
          "it": "Creare una storia con le proprie foto"
        },
        "text": {
          "en": [
            "A dedicated mode lets families build new sequences from personal images.",
            "The game becomes a tool for training memory and creating occasions to talk."
          ],
          "it": [
            "Una modalità dedicata permette alle famiglie di costruire nuove sequenze con immagini personali.",
            "Il gioco diventa così uno strumento per allenare la memoria e creare occasioni di dialogo."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/imfading/imfading-custom-story-1.mp4",
            "poster": "/case/imfading/imfading-video-cover-3.webp",
            "alt": {
              "it": "I'm Fading storia personalizzata",
              "en": "I'm Fading custom story"
            }
          },
          {
            "src": "/case/imfading/imfading-custom-story-2.mp4",
            "poster": "/case/imfading/imfading-video-cover-4.webp",
            "alt": {
              "it": "I'm Fading storia personalizzata",
              "en": "I'm Fading custom story"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "the-black-cat",
    "code": "MSN_001",
    "year": "2023",
    "projectType": [
      "games",
      "storytelling"
    ],
    "accent": "#feff00",
    "icon": "/case/blackcat/theblackcat-icon.svg",
    "image": "/case/blackcat/theblackcat-hero.webp",
    "seoTag": "Narrative Game",
    "customer": "",
    "partner": "",
    "copy": {
      "en": {
        "category": "Literary adaptation / noir visual style / Storytelling",
        "title": "The Black Cat",
        "excerpt": "Memory becomes a narrative device. Every pair rebuilds a recollection; every mistake brings a presence closer.",
        "intro": "The Black Cat is an internal experimental video game inspired by Edgar Allan Poe's story The Black Cat. Players use a variant of the memory game to recover fragments of the story and work out why the protagonist woke up covered in blood. Mistakes, a time limit and rising difficulty turn a familiar mechanic into a noir narrative experience built on memory and guilt.",
        "status": "A BLACK CAT // {_OR_A_HOMICIDE?}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D"
        ],
        "platforms": [
          "PC"
        ]
      },
      "it": {
        "category": "Literary adaptation / noir visual style / Storytelling",
        "title": "The Black Cat",
        "excerpt": "Il Memory diventa un dispositivo narrativo. Ogni coppia ricostruisce un ricordo; ogni errore avvicina una presenza.",
        "intro": "The Black Cat è un videogioco sperimentale interno ispirato al racconto Il gatto nero di Edgar Allan Poe. Il giocatore usa una variante del Memory per recuperare frammenti della storia e capire perché il protagonista si sia risvegliato coperto di sangue. Errori, tempo limitato e difficoltà crescente trasformano una meccanica familiare in un’esperienza narrativa noir basata su memoria e colpa.",
        "status": "A BLACK CAT // {_OR_A_HOMICIDE?}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D"
        ],
        "platforms": [
          "PC"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Waking up with no memories",
          "it": "Svegliarsi senza ricordi"
        },
        "text": {
          "en": [
            "The protagonist wakes up covered in blood with no idea what happened.",
            "Players have to reconstruct the events leading up to that moment, fragment by fragment."
          ],
          "it": [
            "Il protagonista si risveglia coperto di sangue e senza sapere cosa sia accaduto.",
            "Il giocatore deve ricostruire gli eventi che precedono quel momento, frammento dopo frammento."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/blackcat/theblackcat-intro.mp4",
            "poster": "/case/blackcat/theblackcat-intro-1.webp",
            "alt": {
              "it": "Intro animato gioco The Black Cat",
              "en": "The Black Cat animated intro"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "Frames from the opening film",
          "it": "Frame del filmato iniziale"
        },
        "images": [
          {
            "src": "/case/blackcat/theblackcat-intro-1.webp",
            "alt": {
              "it": "Illustrazione intro gioco The Black Cat",
              "en": "The Black Cat intro illustration"
            }
          },
          {
            "src": "/case/blackcat/theblackcat-intro-2.webp",
            "alt": {
              "it": "Illustrazione intro gioco The Black Cat",
              "en": "The Black Cat intro illustration"
            }
          },
          {
            "src": "/case/blackcat/theblackcat-intro-3.webp",
            "alt": {
              "it": "Illustrazione intro gioco The Black Cat",
              "en": "The Black Cat intro illustration"
            }
          },
          {
            "src": "/case/blackcat/theblackcat-intro-4.webp",
            "alt": {
              "it": "Illustrazione intro gioco The Black Cat",
              "en": "The Black Cat intro illustration"
            }
          },
          {
            "src": "/case/blackcat/theblackcat-intro-5.webp",
            "alt": {
              "it": "Illustrazione intro gioco The Black Cat",
              "en": "The Black Cat intro illustration"
            }
          },
          {
            "src": "/case/blackcat/theblackcat-intro-6.webp",
            "alt": {
              "it": "Illustrazione intro gioco The Black Cat",
              "en": "The Black Cat intro illustration"
            }
          },
          {
            "src": "/case/blackcat/theblackcat-intro-7.webp",
            "alt": {
              "it": "Illustrazione intro gioco The Black Cat",
              "en": "The Black Cat intro illustration"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Colour keys for the opening film",
          "it": "Color Key del filmato iniziale"
        },
        "images": [
          {
            "src": "/case/blackcat/theblackcat-concept-1.webp",
            "alt": {
              "it": "Concept Art storia The Black Cat",
              "en": "Concept art for The Black Cat story"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Every card opens a question",
          "it": "Ogni carta apre una domanda"
        },
        "text": {
          "en": [
            "The memory pairs unlock questions and parts of the story.",
            "Wrong answers raise the difficulty, cut the time available and let an unsettling presence surface."
          ],
          "it": [
            "Le coppie del Memory sbloccano domande e parti della storia.",
            "Le risposte errate aumentano la difficoltà, riducono il tempo e fanno emergere una presenza inquietante."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/blackcat/theblackcat-gameplay-2.mp4",
            "poster": "/case/blackcat/theblackcat-cover-2.webp",
            "alt": {
              "it": "Gameplay gioco The Black Cat",
              "en": "The Black Cat gameplay"
            }
          },
          {
            "src": "/case/blackcat/theblackcat-gameplay-1.mp4",
            "poster": "/case/blackcat/theblackcat-cover-1.webp",
            "alt": {
              "it": "Gameplay gioco The Black Cat",
              "en": "The Black Cat gameplay"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Guilt takes shape",
          "it": "La colpa prende forma"
        },
        "text": {
          "en": [
            "The noir art direction uses hard contrasts between light and shadow to make the tension of the story visible.",
            "Mechanic, time and image work together up to the final revelation."
          ],
          "it": [
            "L’art direction noir usa contrasti netti tra luce e ombra per rendere visibile la tensione del racconto.",
            "Meccanica, tempo e immagine lavorano insieme fino alla scoperta finale."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/blackcat/theblackcat-gameplay-end.mp4",
            "poster": "/case/blackcat/theblackcat-cover-4.webp",
            "alt": {
              "it": "Gameplay gioco The Black Cat",
              "en": "The Black Cat gameplay"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Illustrations for the game cards",
          "it": "Illustrazioni delle carte del gioco"
        },
        "images": [
          {
            "src": "/case/blackcat/theblackcat-concept-2.webp",
            "alt": {
              "it": "Carte storia The Black Cat",
              "en": "The Black Cat story cards"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "become-this-way",
    "code": "MSN_001",
    "year": "2023",
    "projectType": [
      "storytelling",
      "content production"
    ],
    "accent": "#7FFFFF",
    "icon": "/case/becomethisway/becomethisway-icon.svg",
    "image": "/case/becomethisway/becomethisway-hero.webp",
    "seoTag": "Character Design",
    "customer": "",
    "partner": "",
    "copy": {
      "en": {
        "category": "Original story / Character Development / Visual Development",
        "title": "Become this way",
        "excerpt": "A robot vacuum wants to become a fish. An interactive tale about identity, expectations and the freedom to choose your own shape.",
        "intro": "Become This Way is an original narrative project developed in-house by Studio MACACO. It tells the story of Cori-D1, a robot vacuum that longs to turn into a fish, and of its conflict with the girl who wants to enter it in an engineering competition. Writing, character design, concept art and Unity prototyping were used to build a story about identity, ambition and acceptance.",
        "status": "WHAT IF // {_A_VACUUM_CLEANER_WANTS_TO?}",
        "capabilities": [
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D"
        ],
        "platforms": [
          "Video"
        ]
      },
      "it": {
        "category": "Original story / Character Development / Visual Development",
        "title": "Become this way",
        "excerpt": "Un robot aspirapolvere vuole diventare un pesce. Un racconto interattivo sull’identità, le aspettative e la libertà di scegliere la propria forma.",
        "intro": "Become This Way è un progetto narrativo originale sviluppato internamente da Studio MACACO. Racconta la storia di Cori-D1, un robot aspirapolvere che desidera trasformarsi in un pesce, e del conflitto con la ragazza che vuole presentarlo a una competizione di ingegneria. Scrittura, character design, concept art e prototipazione in Unity sono stati utilizzati per sviluppare una storia sul rapporto tra identità, ambizione e accettazione.",
        "status": "WHAT IF // {_A_VACUUM_CLEANER_WANTS_TO?}",
        "capabilities": [
          "Art Direction",
          "Storytelling",
          "2D Art",
          "Unity 3D"
        ],
        "platforms": [
          "Video"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "An impossible wish",
          "it": "Un desiderio impossibile"
        },
        "text": {
          "en": [
            "Cori-D1 is a household robot fascinated by the ocean. To get closer to the marine world, it starts modifying its own body.",
            "Its wish collides with the plans of the girl who built it, determined to enter it in an engineering competition."
          ],
          "it": [
            "Cori-D1 è un robot domestico affascinato dall’oceano. Per avvicinarsi al mondo marino, comincia a modificare il proprio corpo.",
            "Il suo desiderio entra in conflitto con il progetto della ragazza che lo ha creato, decisa a presentarlo a una competizione di ingegneria."
          ]
        }
      },
      {
        "type": "videoPlayer",
        "label": {
          "en": "Animatic of the idea",
          "it": "Animatic dell'idea"
        },
        "video": {
          "src": "/case/becomethisway/becomethisway-fullstory.mp4",
          "poster": "/case/becomethisway/becomethisway-cover-1.webp",
          "playIcon": "/general/play-icon.svg",
          "ariaLabel": {
            "it": "Video completo storia Become This Way",
            "en": "Full Become This Way story video"
          },
          "preload": "metadata"
        }
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Shots from the animatic",
          "it": "Shots dell'Animatic"
        },
        "images": [
          {
            "src": "/case/becomethisway/becomethisway-frame-1.webp",
            "alt": {
              "it": "Illustrazioni Become this Way",
              "en": "Become This Way illustrations"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-frame-4.webp",
            "alt": {
              "it": "Illustrazioni Become this Way",
              "en": "Become This Way illustrations"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-frame-2.webp",
            "alt": {
              "it": "Illustrazioni Become this Way",
              "en": "Become This Way illustrations"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-frame-3.webp",
            "alt": {
              "it": "Illustrazioni Become this Way",
              "en": "Become This Way illustrations"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Between control and transformation",
          "it": "Tra controllo e trasformazione"
        },
        "text": {
          "en": [
            "Experiments, accidents and misunderstandings leave both characters facing the same question: follow a perfect model, or recognise what makes the other one happy?",
            "The robot's physical transformation makes the emotional arc of the story visible."
          ],
          "it": [
            "Esperimenti, incidenti e incomprensioni mettono i protagonisti davanti alla stessa domanda: seguire un modello perfetto o riconoscere ciò che rende felice l’altro?",
            "La trasformazione fisica del robot rende visibile il percorso emotivo della storia."
          ]
        }
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Shots from the animatic",
          "it": "Shots dell'Animatic"
        },
        "images": [
          {
            "src": "/case/becomethisway/becomethisway-frame-5.webp",
            "alt": {
              "it": "Illustrazioni Become this Way",
              "en": "Become This Way illustrations"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-frame-6.webp",
            "alt": {
              "it": "Illustrazioni Become this Way",
              "en": "Become This Way illustrations"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-frame-7.webp",
            "alt": {
              "it": "Illustrazioni Become this Way",
              "en": "Become This Way illustrations"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-frame-8.webp",
            "alt": {
              "it": "Illustrazioni Become this Way",
              "en": "Become This Way illustrations"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "A story built to be lived",
          "it": "Una storia costruita per essere vissuta"
        },
        "text": {
          "en": [
            "The project covers writing, concept art, character development, visual moods and tests in Unity.",
            "Every stage translates the theme of acceptance into images, behaviours and interactions."
          ],
          "it": [
            "Il progetto comprende scrittura, concept art, sviluppo dei personaggi, mood visuali e test in Unity.",
            "Ogni fase traduce il tema dell’accettazione in immagini, comportamenti e interazioni."
          ]
        }
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "Mood research and visual development",
          "it": "Ricerca del Mood e Visual Development"
        },
        "images": [
          {
            "src": "/case/becomethisway/becomethisway-mood-2.webp",
            "alt": {
              "it": "Visual Development Become this Way",
              "en": "Become This Way visual development"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-mood-1.webp",
            "alt": {
              "it": "Visual Development Become this Way",
              "en": "Become This Way visual development"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-mood-1.webp",
            "alt": {
              "it": "Visual Development Become this Way",
              "en": "Become This Way visual development"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-mood-4.webp",
            "alt": {
              "it": "Visual Development Become this Way",
              "en": "Become This Way visual development"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "First sketches for Cori-D1",
          "it": "Primi Sketch per Cori-D1"
        },
        "images": [
          {
            "src": "/case/becomethisway/becomethisway-cori-4.webp",
            "alt": {
              "it": "Concept Cori-D1 Become this Way",
              "en": "Cori-D1 concept for Become This Way"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-cori-5.webp",
            "alt": {
              "it": "Concept Cori-D1 Become this Way",
              "en": "Cori-D1 concept for Become This Way"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-cori-1.webp",
            "alt": {
              "it": "Concept Cori-D1 Become this Way",
              "en": "Cori-D1 concept for Become This Way"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-cori-2.webp",
            "alt": {
              "it": "Concept Cori-D1 Become this Way",
              "en": "Cori-D1 concept for Become This Way"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "Cori-D1 clay model",
          "it": "Modello in Pongo di Cori-D1"
        },
        "images": [
          {
            "src": "/case/becomethisway/becomethisway-model-1.webp",
            "alt": {
              "it": "Modello Plastilina Cori-D1 Become this Way",
              "en": "Cori-D1 clay model for Become This Way"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-model-2.webp",
            "alt": {
              "it": "Modello Plastilina Cori-D1 Become this Way",
              "en": "Cori-D1 clay model for Become This Way"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-model-3.webp",
            "alt": {
              "it": "Modello Plastilina Cori-D1 Become this Way",
              "en": "Cori-D1 clay model for Become This Way"
            }
          },
          {
            "src": "/case/becomethisway/becomethisway-model-4.webp",
            "alt": {
              "it": "Modello Plastilina Cori-D1 Become this Way",
              "en": "Cori-D1 clay model for Become This Way"
            }
          }
        ]
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "Visual tests in Unity 3D",
          "it": "Visual Test in Unity 3D"
        },
        "images": [
          {
            "src": "/case/becomethisway/becomethisway-cori-3.webp",
            "alt": {
              "it": "Visual Development Unity 3D Become this Way",
              "en": "Become This Way visual development in Unity 3D"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "aquatar",
    "code": "MSN_001",
    "year": "ongoing",
    "projectType": [
      "ai-experimental",
      "live experience"
    ],
    "accent": "#7FFFFF",
    "icon": "/case/aquatar/aquatar-icon.svg",
    "image": "/case/aquatar/aquatar-hero.webp",
    "seoTag": "AI Assistant",
    "customer": "Abacus Research AG",
    "partner": "Artificialy SA",
    "copy": {
      "en": {
        "category": "AI Assistant / Real-Time 3D / Animation",
        "title": "Aquatar",
        "excerpt": "A digital aquarium. Two virtual characters. An AI system able to turn requests into visible actions.",
        "intro": "Aquatar is a virtual concierge prototype developed by Studio MACACO and Artificialy for Abacus Research AG. Users speak in natural language with Groog, a digital fish that answers out loud and can trigger animations, alter the aquarium or bring up content and 3D models. The project explores an AI assistant able to act inside a real-time environment, beyond the traditional text interface.",
        "status": "UNDER THE SEA // {_DARLING_IS_BETTER!}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "3D Art",
          "Godot",
          "Procedural Animation"
        ],
        "platforms": [
          "PC"
        ]
      },
      "it": {
        "category": "AI Assistant / Real-Time 3D / Animation",
        "title": "Aquatar",
        "excerpt": "Un acquario digitale. Due personaggi virtuali. Un sistema di Intelligenza Artificiale capace di trasformare le richieste in azioni visibili.",
        "intro": "Aquatar è un prototipo di concierge virtuale sviluppato da Studio MACACO e Artificialy per Abacus Research AG. L’utente parla in linguaggio naturale con Groog, un pesce digitale che risponde a voce e può attivare animazioni, modificare l’acquario o mostrare contenuti e modelli 3D. Il progetto serve a sperimentare un assistente AI capace di agire dentro un ambiente real-time, oltre la tradizionale interfaccia testuale.",
        "status": "UNDER THE SEA // {_DARLING_IS_BETTER!}",
        "capabilities": [
          "Real-Time Development",
          "Art Direction",
          "3D Art",
          "Godot",
          "Procedural Animation"
        ],
        "platforms": [
          "PC"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Talking to a digital world",
          "it": "Parlare con un mondo digitale"
        },
        "text": {
          "en": [
            "Aquatar is an interactive 3D environment built to explore a new kind of virtual concierge.",
            "Users talk freely with Groog. The system interprets every request and turns it into a spoken answer, an animation, a graphic interface or an action inside the aquarium."
          ],
          "it": [
            "Aquatar è un ambiente 3D interattivo sviluppato per sperimentare una nuova forma di concierge virtuale.",
            "L’utente conversa liberamente con Groog. Il sistema interpreta ogni richiesta e la traduce in una risposta verbale, un’animazione, un’interfaccia grafica o un’azione nell’acquario."
          ]
        }
      },
      {
        "type": "imageGrid",
        "label": {
          "en": "The concierge in use",
          "it": "Esempi di utilizzo del Concierge"
        },
        "images": [
          {
            "src": "/case/aquatar/aquatar-photo-1.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar-photo-2.webp",
            "alt": {
              "it": "Concierge digitale per alberghi",
              "en": "Digital concierge for hotels"
            }
          }
        ]
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/aquatar/aquatar-speak-2.mp4",
            "poster": "/case/aquatar/aquatar-cover-1.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar-speak-3.mp4",
            "poster": "/case/aquatar/aquatar-cover-2.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "When words reshape the space",
          "it": "Quando le parole modificano lo spazio"
        },
        "text": {
          "en": [
            "Groog can trigger animations, change the setting and present content through dedicated interfaces.",
            "Some commands let him generate and display 3D models while the experience is running."
          ],
          "it": [
            "Groog può attivare animazioni, modificare lo scenario e mostrare contenuti attraverso interfacce dedicate.",
            "Alcuni comandi gli permettono di generare e visualizzare modelli 3D mentre l’esperienza è in esecuzione."
          ]
        }
      },
      {
        "type": "videoGrid",
        "label": {
          "en": "Events and activities on request",
          "it": "Eventi e attività su richiesta dell'utente"
        },
        "videos": [
          {
            "src": "/case/aquatar/aquatar-drain.mp4",
            "poster": "/case/aquatar/aquatar-cover-4.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar-fill.mp4",
            "poster": "/case/aquatar/aquatar-cover-5.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar-outfit.mp4",
            "poster": "/case/aquatar/aquatar-cover-9.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar-phone.mp4",
            "poster": "/case/aquatar/aquatar-cover-13.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          }
        ]
      },
      {
        "type": "videoGrid",
        "label": {
          "en": "Interchangeable settings for different audiences",
          "it": "Scenari intercambiabili a seconda del pubblico"
        },
        "videos": [
          {
            "src": "/case/aquatar/aquatar-hotel-env.mp4",
            "poster": "/case/aquatar/aquatar-cover-14.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar-software-env.mp4",
            "poster": "/case/aquatar/aquatar-cover-15.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Two characters, two ways of communicating",
          "it": "Due personaggi, due modi di comunicare"
        },
        "text": {
          "en": [
            "Groog gives the system its voice. Bonk widens what it can express through gestures, animations, signs and actions on the scene.",
            "The characters let the AI communicate without breaking the continuity of the experience."
          ],
          "it": [
            "Groog dà voce al sistema. Bonk amplia le possibilità comunicative attraverso gesti, animazioni, cartelli e azioni sullo scenario.",
            "I personaggi permettono all’AI di comunicare senza interrompere la continuità dell’esperienza."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/aquatar/aquatar-destroy.mp4",
            "poster": "/case/aquatar/aquatar-cover-6.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar-restore.mp4",
            "poster": "/case/aquatar/aquatar-cover-7.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar-photo-success.mp4",
            "poster": "/case/aquatar/aquatar-cover-11.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          },
          {
            "src": "/case/aquatar/aquatar_detective.mp4",
            "poster": "/case/aquatar/aquatar-cover-17.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          }
        ]
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/aquatar/aquatar-seasons.mp4",
            "poster": "/case/aquatar/aquatar-cover-16.webp",
            "alt": {
              "it": "Concierge digitale con AI Aquatar",
              "en": "Aquatar AI digital concierge"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "From research to prototype",
          "it": "Dalla ricerca al prototipo"
        },
        "text": {
          "en": [
            "Studio MACACO handled art direction, characters, 3D modelling, animation and the real-time software base.",
            "Artificialy developed and integrated the artificial intelligence technologies."
          ],
          "it": [
            "Studio MACACO ha curato direzione artistica, personaggi, modellazione 3D, animazioni e base software real-time.",
            "Artificialy ha sviluppato e integrato le tecnologie di Intelligenza Artificiale."
          ]
        }
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "Concept Art",
          "it": "Concept Art"
        },
        "images": [
          {
            "src": "/case/aquatar/aquatar-concept-4.webp",
            "alt": {
              "it": "Concept Art per Aquatar",
              "en": "Concept art for Aquatar"
            }
          },
          {
            "src": "/case/aquatar/aquatar-concept-5.webp",
            "alt": {
              "it": "Concept Art per Aquatar",
              "en": "Concept art for Aquatar"
            }
          },
          {
            "src": "/case/aquatar/aquatar-concept-6.webp",
            "alt": {
              "it": "Concept Art per Aquatar",
              "en": "Concept art for Aquatar"
            }
          },
          {
            "src": "/case/aquatar/aquatar-concept-7.webp",
            "alt": {
              "it": "Concept Art per Aquatar",
              "en": "Concept art for Aquatar"
            }
          },
          {
            "src": "/case/aquatar/aquatar-concept-1.webp",
            "alt": {
              "it": "Concept Art per Aquatar",
              "en": "Concept art for Aquatar"
            }
          },
          {
            "src": "/case/aquatar/aquatar-concept-2.webp",
            "alt": {
              "it": "Concept Art per Aquatar",
              "en": "Concept art for Aquatar"
            }
          },
          {
            "src": "/case/aquatar/aquatar-concept-3.webp",
            "alt": {
              "it": "Concept Art per Aquatar",
              "en": "Concept art for Aquatar"
            }
          }
        ]
      }
    ]
  },
  {
    "slug": "bullying-vr",
    "code": "MSN_001",
    "year": "2023-2024",
    "projectType": [
      "games for impact",
      "games"
    ],
    "accent": "#feff00",
    "icon": "/case/bullyingvr/bullyingvr-icon.svg",
    "image": "/case/bullyingvr/bullyingvr-hero.webp",
    "seoTag": "VR Training",
    "customer": "Croce Rossa Svizzera - Sottoceneri",
    "partner": "",
    "copy": {
      "en": {
        "category": "Branching Story / VR Training / Motion Capture",
        "title": "Bullying VR",
        "excerpt": "The same situation lived from three perspectives. A VR simulation for understanding the roles, emotions and consequences of bullying.",
        "intro": "Bullying VR is an educational virtual reality experience developed for the Swiss Red Cross — Sottoceneri Section and used in middle schools with the support of trainers. Students live through the same bullying episode as the bully, the victim and the bystander, making choices that change the story. The project uses immersion and guided discussion to raise awareness of bullying and cyberbullying.",
        "status": "NOTHING FUN TO SAY // {_STOP_BULLYING}",
        "capabilities": [
          "Real-Time Development",
          "Unity 3D",
          "Character Animation"
        ],
        "platforms": [
          "Virtual Reality"
        ]
      },
      "it": {
        "category": "Branching Story / VR Training / Motion Capture",
        "title": "Bullying VR",
        "excerpt": "La stessa situazione vissuta da tre prospettive. Una simulazione VR per comprendere ruoli, emozioni e conseguenze del bullismo.",
        "intro": "Bullying VR è un’esperienza educativa in Realtà Virtuale sviluppata per Croce Rossa Svizzera — Sezione del Sottoceneri e utilizzata nelle scuole medie con il supporto di formatori. Gli studenti vivono lo stesso episodio di bullismo nei ruoli di bullo, vittima e spettatore, compiendo scelte che modificano la storia. Il progetto usa immedesimazione e confronto guidato per aumentare la consapevolezza su bullismo e cyberbullismo.",
        "status": "NOTHING FUN TO SAY // {_STOP_BULLYING}",
        "capabilities": [
          "Real-Time Development",
          "Unity 3D",
          "Character Animation"
        ],
        "platforms": [
          "Virtual Reality"
        ]
      }
    },
    "sections": [
      {
        "type": "splitIntro",
        "title": {
          "en": "Entering the same story from three sides",
          "it": "Entrare nella stessa storia da tre lati"
        },
        "text": {
          "en": [
            "The experience follows an episode of school bullying from the point of view of the bully, the victim and the bystander.",
            "Switching roles reveals motivations, emotions and responsibilities that a single perspective would leave invisible."
          ],
          "it": [
            "L’esperienza segue un episodio di bullismo scolastico dal punto di vista del bullo, della vittima e dello spettatore.",
            "Cambiare ruolo permette di osservare motivazioni, emozioni e responsabilità che una sola prospettiva lascerebbe invisibili."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/bullyingvr/bullyingvr-bully.mp4",
            "poster": "/case/bullyingvr/bullyingvr-cover-1.webp",
            "alt": {
              "it": "Esperienza Bullo per Bullying VR",
              "en": "Bully perspective in Bullying VR"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-victim.mp4",
            "poster": "/case/bullyingvr/bullyingvr-cover-2.webp",
            "alt": {
              "it": "Esperienza Vittima per Bullying VR",
              "en": "Victim perspective in Bullying VR"
            }
          }
        ]
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/bullyingvr/bullyingvr-spectator.mp4",
            "poster": "/case/bullyingvr/bullyingvr-cover-3.webp",
            "alt": {
              "it": "Esperienza Spettatore per Bullying VR",
              "en": "Bystander perspective in Bullying VR"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Every choice changes the situation",
          "it": "Ogni scelta modifica la situazione"
        },
        "text": {
          "en": [
            "As the story unfolds, players decide how to react.",
            "They can go along with the violent behaviour, interrupt it or stay passive, experiencing the consequences of their own position first hand."
          ],
          "it": [
            "Durante il racconto il giocatore decide come reagire.",
            "Può assecondare il comportamento violento, interromperlo o restare passivo, sperimentando direttamente le conseguenze della propria posizione."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/bullyingvr/bullyingvr-group.mp4",
            "poster": "/case/bullyingvr/bullyingvr-cover-4.webp",
            "alt": {
              "it": "Esperienza Bullo per Bullying VR",
              "en": "Bully perspective in Bullying VR"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-phone.mp4",
            "poster": "/case/bullyingvr/bullyingvr-cover-5.webp",
            "alt": {
              "it": "Esperienza Bullo per Bullying VR",
              "en": "Bully perspective in Bullying VR"
            }
          }
        ]
      },
      {
        "type": "imageCarousel",
        "label": {
          "en": "Storyboard of the experience",
          "it": "Storyboard dell'esperienza"
        },
        "images": [
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-1.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-2.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-3.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-4.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-5.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-6.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-7.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-8.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-storyboard-9.webp",
            "alt": {
              "it": "Storyboard Bullying VR",
              "en": "Bullying VR storyboard"
            }
          }
        ]
      },
      {
        "type": "splitIntro",
        "title": {
          "en": "Real bodies, rebuilt environment",
          "it": "Corpi reali, ambiente ricostruito"
        },
        "text": {
          "en": [
            "The animations come from motion capture sessions and from a system dedicated to facial expressions.",
            "The classroom was rebuilt in 3D using schools in Canton Ticino as reference."
          ],
          "it": [
            "Le animazioni derivano da sessioni di Motion Capture e da un sistema dedicato alle espressioni facciali.",
            "La classe è stata ricostruita in 3D prendendo come riferimento le scuole del Canton Ticino."
          ]
        }
      },
      {
        "type": "videoGrid",
        "videos": [
          {
            "src": "/case/bullyingvr/bullyingvr-prototype.mp4",
            "poster": "/case/bullyingvr/bullyingvr-cover-6.webp",
            "alt": {
              "it": "Tuta Motion Capture",
              "en": "Motion capture suit"
            }
          },
          {
            "src": "/case/bullyingvr/bullyingvr-prototype-2.mp4",
            "poster": "/case/bullyingvr/bullyingvr-cover-7.webp",
            "alt": {
              "it": "Tuta Motion Capture",
              "en": "Motion capture suit"
            }
          }
        ]
      }
    ]
  }
]

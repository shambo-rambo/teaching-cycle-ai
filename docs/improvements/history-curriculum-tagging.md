const ibDpHistoryCurriculum = {
  subject: "History",
  group: "Group 3: Individuals and Societies",
  levels: ["SL", "HL"],
  
  assessmentObjectives: {
    AO1: {
      name: "Knowledge and understanding",
      description: "Demonstrate detailed, relevant and accurate historical knowledge"
    },
    AO2: {
      name: "Application and analysis",
      description: "Formulate clear and coherent arguments"
    },
    AO3: {
      name: "Synthesis and evaluation",
      description: "Integrate evidence and analysis to produce a coherent response"
    },
    AO4: {
      name: "Use and application of appropriate skills",
      description: "Structure and develop focused essays"
    }
  },

  // Key concepts that run throughout the course
  keyConcepts: [
    "Change",
    "Continuity",
    "Causation",
    "Consequence",
    "Significance",
    "Perspectives"
  ],

  // 1. PRESCRIBED SUBJECTS (Choose 1 from 5)
  prescribedSubjects: {
    PS1: {
      id: "PS1",
      title: "Military leaders",
      description: "Focus on medieval military leaders and their impact",
      caseStudies: {
        CS1_1: {
          id: "PS1_CS1",
          title: "Genghis Khan (c1200-1227)",
          topics: {
            leadership: [
              "Rise to power; uniting of rival tribes",
              "Motives and objectives; success in achieving those objectives",
              "Reputation: military prowess; naming as Genghis Khan (1206)",
              "Importance of Genghis Khan's leadership to Mongol success"
            ],
            campaigns: [
              "Mongol invasion of China: attacks on the Jin dynasty; capture of Beijing (1215)",
              "Mongol invasion of Central Asia and Iran; Mongol invasion of Khwarezmia (1219-1221)",
              "Mongol military technology, organization, strategy and tactics"
            ],
            impact: [
              "Political impact: administration; overthrowing of existing ruling systems",
              "Economic impact: establishment, enhancement and protection of trade routes",
              "Social, cultural and religious impact: population displacement; terror; religious freedom"
            ]
          }
        },
        CS1_2: {
          id: "PS1_CS2",
          title: "Richard I of England (1173-1199)",
          topics: {
            leadership: [
              "Rise to power: revolt of Richard I and his brothers against Henry II (1173-1174)",
              "Reputation: military prowess; chivalry; 'Richard the Lionheart'",
              "Motives and objectives: defence and recovery of French lands; defence of crusader states"
            ],
            campaigns: [
              "Occupation of Sicily (1190-1191); conquest of Cyprus (1191)",
              "Involvement in the Third Crusade (1191-1192)",
              "The course, outcome and effects of Richard I's campaigns"
            ],
            impact: [
              "Political impact in England: absence of the king; political instability",
              "Political impact in France: growth in prestige of Capetian monarchy",
              "Economic impact: raising money for campaigns; taxation",
              "Social, cultural and religious impact: anti-Jewish violence; treatment of Muslim prisoners"
            ]
          }
        }
      }
    },
    PS2: {
      id: "PS2",
      title: "Conquest and its impact",
      description: "Focus on Spanish conquest",
      caseStudies: {
        CS2_1: {
          id: "PS2_CS1",
          title: "The final stages of Muslim rule in Spain",
          topics: {
            contextAndMotives: [
              "Political context in Iberia and Al-Andalus in the late 15th century",
              "Social and economic context in late 15th century",
              "Motives: political motives; religious motives and role of the church"
            ],
            keyEventsAndActors: [
              "The Granada War and conquest of Granada (1482-1492)",
              "Treaty of Granada (1491); Alhambra decree (1492)",
              "Key actors: Fernando de Aragón and Isabel de Castilla; Abu Abdallah; Tomás de Torquemada"
            ],
            impact: [
              "Social and demographic changes; persecution, enslavement and emigration",
              "Forced conversions and expulsions; Marranos, Mudéjars",
              "The Spanish Inquisition"
            ]
          }
        },
        CS2_2: {
          id: "PS2_CS2",
          title: "The conquest of Mexico and Peru (1519-1551)",
          topics: {
            contextAndMotives: [
              "Political and economic motives for exploration and conquest",
              "Religious arguments for the conquest"
            ],
            keyEventsAndActors: [
              "Hernán Cortés and the campaign against the Aztec Empire",
              "Francisco Pizarro and the campaign against the Incas",
              "Key actors: Diego de Almagro, Malinche, Atahualpa, Moctezuma II"
            ],
            impact: [
              "Social and economic impact on indigenous populations",
              "Causes and effects of demographic change; spread of disease",
              "Cultural impact: religion, language"
            ]
          }
        }
      }
    },
    PS3: {
      id: "PS3",
      title: "The move to global war",
      description: "Military expansion from 1931 to 1941",
      caseStudies: {
        CS3_1: {
          id: "PS3_CS1",
          title: "Japanese expansion in East Asia (1931-1941)",
          topics: {
            causesOfExpansion: [
              "Impact of Japanese nationalism and militarism on foreign policy",
              "Japanese domestic issues: political and economic issues",
              "Political instability in China"
            ],
            events: [
              "Japanese invasion of Manchuria and northern China (1931)",
              "Sino-Japanese War (1937-1941)",
              "The Three Power/Tripartite Pact; Pearl Harbor (1941)"
            ],
            responses: [
              "League of Nations and the Lytton report",
              "Political developments within China—the Second United Front",
              "International response, including US initiatives"
            ]
          }
        },
        CS3_2: {
          id: "PS3_CS2",
          title: "German and Italian expansion (1933-1940)",
          topics: {
            causesOfExpansion: [
              "Impact of fascism and Nazism on foreign policies",
              "Impact of domestic economic issues",
              "Changing diplomatic alignments; end of collective security; appeasement"
            ],
            events: [
              "German challenges to post-war settlements (1933-1938)",
              "Italian expansion: Abyssinia (1935-1936); Albania",
              "German expansion (1938-1939); Pact of Steel, Nazi-Soviet Pact"
            ],
            responses: [
              "International response to German aggression (1933-1938)",
              "International response to Italian aggression (1935-1936)",
              "International response to German and Italian aggression (1940)"
            ]
          }
        }
      }
    },
    PS4: {
      id: "PS4",
      title: "Rights and protest",
      description: "Struggles for rights and freedoms in the mid-20th century",
      caseStudies: {
        CS4_1: {
          id: "PS4_CS1",
          title: "Civil rights movement in the United States (1954-1965)",
          topics: {
            natureOfDiscrimination: [
              "Racism and violence against African Americans; the Ku Klux Klan",
              "Segregation and education; Brown vs Board of Education (1954)",
              "Economic and social discrimination; Jim Crow laws"
            ],
            protestsAndAction: [
              "Non-violent protests; Montgomery bus boycott (1955-1956)",
              "Freedom Rides (1961); Freedom Summer (1964)",
              "Legislative changes: Civil Rights Act (1964); Voting Rights Act (1965)"
            ],
            keyActorsAndGroups: [
              "Key actors: Martin Luther King Jr; Malcolm X; Lyndon B Johnson",
              "Key groups: NAACP; SCLC and SNCC; Nation of Islam"
            ]
          }
        },
        CS4_2: {
          id: "PS4_CS2",
          title: "Apartheid South Africa (1948-1964)",
          topics: {
            natureOfDiscrimination: [
              "'Petty Apartheid' and 'Grand Apartheid' legislation",
              "Division and classification; segregation; townships/forced removals",
              "Bantustan system; impact on individuals"
            ],
            protestsAndAction: [
              "Non-violent protests: bus boycotts; defiance campaign, Freedom Charter",
              "Increasing violence: Sharpeville massacre (1960)",
              "Official response: Rivonia trial (1963-1964)"
            ],
            keyActorsAndGroups: [
              "Key individuals: Nelson Mandela; Albert Luthuli",
              "Key groups: ANC; SACP and MK (Umkhonto we Sizwe)"
            ]
          }
        }
      }
    },
    PS5: {
      id: "PS5",
      title: "Conflict and intervention",
      description: "Conflict and intervention in the late 20th century",
      caseStudies: {
        CS5_1: {
          id: "PS5_CS1",
          title: "Rwanda (1990-1998)",
          topics: {
            causesOfConflict: [
              "Ethnic tensions; Hutu power movement and Interahamwe",
              "Economic situation; colonial legacy",
              "Rwandan Civil War (1990-1993); assassination of Habyarimana"
            ],
            courseAndInterventions: [
              "Actions of RPF and Rwandan government",
              "Nature of genocide and crimes against humanity",
              "Response of international community; UNAMIR"
            ],
            impact: [
              "Social impact; refugee crisis; justice and reconciliation",
              "International impact; establishment of ICTR (1994)",
              "Political and economic impact; continued warfare in DRC"
            ]
          }
        },
        CS5_2: {
          id: "PS5_CS2",
          title: "Kosovo (1989-2002)",
          topics: {
            causesOfConflict: [
              "Ethnic tensions between Serbs and Kosovar Albanians",
              "Political causes: constitutional reforms (1989-1994)",
              "Role of Milosevic and Rugova"
            ],
            courseAndInterventions: [
              "Actions of KLA, Serbian government",
              "Ethnic cleansing; Račak massacre",
              "NATO bombing campaign; KFOR"
            ],
            impact: [
              "Social and economic consequences; refugee crisis",
              "Political impact; election of Rugova (2002)",
              "International reaction; ICTY; indictment of Milosevic"
            ]
          }
        }
      }
    }
  },

  // 2. WORLD HISTORY TOPICS (Choose 2 from 12)
  worldHistoryTopics: {
    WHT1: {
      id: "WHT1",
      title: "Society and economy (750-1400)",
      prescribedContent: {
        societyAndEconomy: [
          "Changes in social structures and systems",
          "Impact of population change; impact of famines and disease",
          "Role and status of women in society",
          "Development of trading routes and economic integration",
          "Changes in travel and transportation"
        ],
        culturalAndIntellectual: [
          "Role and significance of key individuals",
          "Factors affecting transmission of ideas and cultures",
          "Significance and impact of artistic and cultural developments",
          "Developments in science and technology"
        ],
        religionAndSociety: [
          "Social and economic influence of religious institutions",
          "Religious leaders: role and status in government",
          "Treatment of religious minorities; religious persecution",
          "Spread of religion"
        ]
      }
    },
    WHT2: {
      id: "WHT2",
      title: "Causes and effects of wars (750-1500)",
      prescribedContent: {
        typesAndCauses: [
          "Dynastic, territorial and religious disputes",
          "Economic causes, competition for resources",
          "Political causes",
          "Religious causes",
          "Long-term, short-term and immediate causes"
        ],
        courseAndPractices: [
          "Role and significance of leaders",
          "Mobilization of human and economic resources",
          "Logistics, tactics and organization of warfare",
          "Role and significance of women"
        ],
        effects: [
          "Conquest, boundary and dynastic changes",
          "Successes and failures of peacemaking",
          "Political impact: short-term and long-term",
          "Economic, social, religious and cultural changes",
          "Demographic changes and population movements"
        ]
      }
    },
    WHT3: {
      id: "WHT3",
      title: "Dynasties and rulers (750-1500)",
      prescribedContent: {
        dynastiesAndRulers: [
          "Individual rulers: nature of power and rule; aims and achievements",
          "Methods used to legitimize, consolidate and maintain rule",
          "Expansion of dynasties/kingdoms: reasons and methods"
        ],
        lawAndAdministration: [
          "Methods of government and administration",
          "Effects of religious and secular law",
          "Administration and interpretation of law",
          "Role and duties of officials; role of nobility and elite"
        ],
        challenges: [
          "Successes and failures of dynasties and rulers",
          "Internal and external challenges to power",
          "Rebellion and/or political opposition",
          "Rivalries and issues of succession"
        ]
      }
    },
    WHT4: {
      id: "WHT4",
      title: "Societies in transition (1400-1700)",
      prescribedContent: {
        socialAndEconomicChange: [
          "Changing social structures and systems; role of women",
          "Population expansion and movements",
          "Treatment of minority or indigenous peoples",
          "Economic change: development of trade; role of merchants"
        ],
        culturalAndIntellectualChange: [
          "Artistic, cultural and intellectual movements",
          "Cross-cultural exchange",
          "Scientific and technological developments",
          "Role of key intellectual/scientific figures"
        ],
        religiousChange: [
          "Religion and the state: interactions and relationships",
          "Religious expansion and conversion",
          "Religious division, conflict, discrimination and persecution"
        ]
      }
    },
    WHT5: {
      id: "WHT5",
      title: "Early Modern states (1450-1789)",
      prescribedContent: {
        natureOfPowerAndRule: [
          "States in ascendancy and states in decline",
          "Methods and models of government",
          "Individual rulers: ideology, nature of rule, ambition",
          "Legitimacy; successes and failures"
        ],
        expansion: [
          "Territorial expansion via assimilation/unification",
          "Colonial and/or imperial expansion",
          "Political, economic and religious rationale",
          "Political organization and methods of government"
        ],
        conflictsAndChallenges: [
          "Methods of maintaining power within states",
          "Support and opposition; challenges to power",
          "Rivalries and tensions; issues of succession",
          "Challenges to colonial rule: resistance and rebellions"
        ]
      }
    },
    WHT6: {
      id: "WHT6",
      title: "Causes and effects of Early Modern wars (1500-1750)",
      prescribedContent: {
        causesOfConflicts: [
          "Ideological and political causes",
          "Economic causes; competition for resources",
          "Religious causes",
          "Short- and long-term causes"
        ],
        practicesAndImpact: [
          "Role and significance of leaders",
          "Mobilization of human and economic resources",
          "Organization of warfare; land and sea strategies",
          "Significance of technological developments",
          "Influence and involvement of foreign powers"
        ],
        effects: [
          "Peacemaking: successes and failures",
          "Economic, political and territorial impact",
          "Social and religious impact",
          "Demographic changes and population movements"
        ]
      }
    },
    WHT7: {
      id: "WHT7",
      title: "Origins, development and impact of industrialization (1750-2005)",
      prescribedContent: {
        originsOfIndustrialization: [
          "Causes and enablers of industrialization",
          "Availability of human and natural resources",
          "Political stability; infrastructure",
          "Role of technological developments",
          "Role of individuals"
        ],
        impactOfKeyDevelopments: [
          "Developments in transportation",
          "Developments in energy and power",
          "Impact of technological developments",
          "Changing patterns of production: mass production",
          "Developments in communications"
        ],
        socialAndPoliticalImpact: [
          "Urbanization and growth of cities and factories",
          "Labour conditions; organization of labour",
          "Political representation; opposition to industrialization",
          "Impact on standards of living; disease and life expectancy"
        ]
      }
    },
    WHT8: {
      id: "WHT8",
      title: "Independence movements (1800-2000)",
      prescribedContent: {
        originsAndRise: [
          "Development of movements: role of nationalism and political ideology",
          "Role of religion, race, social and economic factors",
          "Wars as a cause/catalyst for independence movements",
          "Internal and external factors fostering growth"
        ],
        methodsAndSuccess: [
          "Methods of achieving independence (violent and non-violent)",
          "Role and importance of leaders",
          "Role of other factors in success of movements"
        ],
        challengesAndResponses: [
          "Political problems; ethnic, racial and separatist movements",
          "Social, cultural and economic challenges",
          "Responses to challenges and their effectiveness"
        ]
      }
    },
    WHT9: {
      id: "WHT9",
      title: "Emergence and development of democratic states (1848-2000)",
      prescribedContent: {
        emergenceOfDemocraticStates: [
          "Conditions encouraging demand for democratic reform",
          "Role and significance of leaders",
          "Development of political parties, constitutions, electoral systems",
          "Significance of developments in emergence of democracy"
        ],
        developmentOfDemocraticStates: [
          "Factors influencing evolution: immigration, ideology, economic forces",
          "Responses to and impact of domestic crises",
          "Struggle for equality: suffrage movements; civil protests"
        ],
        aimsAndResults: [
          "Social and economic policies and reforms",
          "Impact of changing social and economic policies",
          "Cultural impact; freedom of expression"
        ]
      }
    },
    WHT10: {
      id: "WHT10",
      title: "Authoritarian states (20th century)",
      prescribedContent: {
        emergenceOfAuthoritarianStates: [
          "Conditions in which states emerged: economic factors, social division",
          "Impact of war; weakness of political system",
          "Methods used to establish states: persuasion, coercion, propaganda"
        ],
        consolidationAndMaintenance: [
          "Use of legal methods; use of force",
          "Charismatic leadership; dissemination of propaganda",
          "Nature, extent and treatment of opposition",
          "Impact of success/failure of foreign policy"
        ],
        aimsAndResults: [
          "Aims and impact of domestic policies",
          "Impact of policies on women and minorities",
          "Authoritarian control and extent to which achieved"
        ]
      }
    },
    WHT11: {
      id: "WHT11",
      title: "Causes and effects of 20th century wars",
      prescribedContent: {
        causesOfWar: [
          "Economic, ideological, political, territorial causes",
          "Short-term and long-term causes"
        ],
        practicesOfWar: [
          "Types of war: civil wars, wars between states, guerrilla wars",
          "Technological developments; air, naval and land warfare",
          "Extent of mobilization of human and economic resources",
          "Influence/involvement of foreign powers"
        ],
        effectsOfWar: [
          "Successes and failures of peacemaking",
          "Territorial changes",
          "Political impact: short-term and long-term",
          "Economic, social and demographic impact",
          "Changes in role and status of women"
        ]
      }
    },
    WHT12: {
      id: "WHT12",
      title: "The Cold War: Superpower tensions and rivalries (20th century)",
      prescribedContent: {
        rivalryMistrustAccord: [
          "Breakdown of Grand Alliance and emergence of superpower rivalry",
          "US, USSR and China—superpower relations (1947-1979)",
          "Confrontation and reconciliation; reasons for end of Cold War"
        ],
        leadersAndNations: [
          "Impact of two leaders from different regions",
          "Economic, social and cultural impact on two countries"
        ],
        coldWarCrises: [
          "Detailed study of any two Cold War crises from different regions",
          "Examination and comparison of causes, impact and significance"
        ]
      }
    }
  },

  // 3. HL OPTIONS (Choose 1 from 4, then 3 sections from 18)
  hlOptions: {
    HLO1: {
      id: "HLO1",
      title: "History of Africa and the Middle East",
      sections: {
        1: {
          id: "HLO1_S1",
          title: "The 'Abbasid dynasty (750-1258)",
          content: [
            "Fall of Umayyads and 'Abbasid Revolution",
            "Political, social and economic aspects of first century",
            "Religious aspects; role of Ulama",
            "Impact of other civilizations; Sassanian heritage",
            "Case studies: al-Mansur; Harun al-Rashid; al-Ma'mun",
            "Science, culture, philosophy during Golden Age",
            "Decline of empire; Mongol invasion"
          ]
        },
        2: {
          id: "HLO1_S2",
          title: "The Fatimids (909-1171)",
          content: [
            "Foundation of dynasty; political, economic and social factors",
            "Conquest of Egypt and foundation of Cairo",
            "Fatimid claims to caliphate",
            "Fatimid ideology and historical impact",
            "Economic developments including trade",
            "Height of Fatimid Empire; institutions",
            "Decline of Fatimids",
            "Case studies: al-Mu'izz; al-Hakim; al-Mustansir"
          ]
        },
// Complete IB History HL Options Structure
// Based on IB History Guide - First examinations 2020

const hlOptions = {
  HLO1: {
    id: "HLO1",
    title: "History of Africa and the Middle East",
    sections: {
      1: {
        id: "HLO1_S1",
        title: "The 'Abbasid dynasty (750-1258)",
        content: [
          "Fall of Umayyads and 'Abbasid Revolution; reasons for 'Abbasid defeat of Umayyads",
          "Role of 'Abbasid military power; consequences of revolution; shift of power from Syria to Iraq",
          "Political, social and economic aspects of first century of 'Abbasid rule",
          "Religious aspects of 'Abbasid rule; role of Ulama",
          "Impact of other civilizations on 'Abbasids; Sassanian heritage",
          "Case studies: al-Mansur; Harun al-Rashid; al-Ma'mun",
          "Science, culture, philosophy and invention during Golden Age of Islam",
          "Decline of empire; breakdown of 'Abbasid authority; rifts and divisions; Mongol invasion"
        ]
      },
      2: {
        id: "HLO1_S2",
        title: "The Fatimids (909-1171)",
        content: [
          "Foundation of dynasty; political, economic and social factors",
          "Conquest of Egypt and foundation of Cairo; reasons for and impact of conquest",
          "Fatimid claims to caliphate: 'Abbasids and Umayyads of Spain",
          "Fatimid ideology and historical impact; religious relations (Muslims, Coptic Christians, Jews)",
          "Economic developments including trade within Fatimid realm of influence",
          "Height of Fatimid Empire; government institutions; institutions of learning (Dar al-'Ilm)",
          "Decline of Fatimids: internal dissolution; external challenges",
          "Case studies of two: al-Mu'izz (953-975); al-Hakim (996-1021); al-Mustansir (1036-1094)"
        ]
      },
      3: {
        id: "HLO1_S3",
        title: "The Crusades (1095-1291)",
        content: [
          "Origins and motives for Crusades: religious and secular; holy places; pilgrimage and preaching",
          "Theory and practice of jihad",
          "First Crusade (1096-1099); Second Crusade (1145-1149); Third Crusade (1189-1192); Fourth Crusade (1202-1204)",
          "Foundation of crusader states: Jerusalem, Antioch, Edessa and Tripoli",
          "Role and significance of key individuals: Godfrey de Bouillon, Richard I, Nur al-Din, Saladin, Baibars",
          "Military aspects: tactics, major battles and weapons; Templars, Hospitallers, Assassins",
          "Reasons for successes and failures of both sides throughout the period",
          "Impact and importance of Crusades in Middle East and Byzantine Empire"
        ]
      },
      4: {
        id: "HLO1_S4",
        title: "The Ottomans (1281-1566)",
        content: [
          "Rise of Ottomans: Anatolia and the Balkans",
          "Effects of foundation of Ottoman Empire on Europe and Muslim lands",
          "Rise of Safavids and contest with Ottomans",
          "Ottoman expansion: reasons for; conquests of Egypt and Syria; fall of Mamluks",
          "Military and administrative nature of Ottoman Empire; changes to Islamic world",
          "Ottoman invasion and capture of Byzantium; fall of Constantinople (1453)",
          "Effect on transforming Ottoman state",
          "Case studies of two: Mehmet II (1451-1481); Selim I (1512-1520); Suleiman the Magnificent (1520-1566)"
        ]
      },
      5: {
        id: "HLO1_S5",
        title: "Trade and the rise and decline of African states and empires (800-1600)",
        content: [
          "Types of trade: trans-Saharan trade in gold and salt; importance of different routes",
          "Control over trade routes; impact on rise and decline of empires",
          "Indian Ocean trade in slaves, ivory, spices and textiles",
          "Impact of trade on spread of religion and culture: Islamization of East and West Africa",
          "Influence of Catholicism in Kingdom of Kongo",
          "Ghana Empire (c830-1235): causes of rise and decline; system of government; social and economic organization",
          "Mali Empire (c1230-1600): causes of rise and decline; social, economic and administrative reforms",
          "Rise and expansion of Kingdom of Kongo to 1600; political, social and economic organization",
          "Swahili city states: importance of Indian Ocean trade; emergence of cosmopolitan Swahili culture"
        ]
      },
      6: {
        id: "HLO1_S6",
        title: "Pre-colonial African states (1800-1900)",
        content: [
          "Rise of Zulu under Shaka; Mfecane/Difaqane—social, political and economic causes and effects",
          "Rise of Sotho under Moshoeshoe",
          "Rise of Sokoto Caliphate under Usman Dan Fodio, and its effects",
          "Rise of Niger Delta trading states: Nana and Jaja",
          "Ethiopian unification and expansion under Tewodros II, Yohannes IV, Menelik II",
          "Rise of Mahdist state in Sudan",
          "Case studies of rise of two: Mandinka Empire under Samori Toure; Lozi kingdom under Lewanika",
          "Ndebele kingdom under Mzilikazi and Lobengula; Asante empire under Osei Tutu; Nyamwezi under Mirambo; Hehe state under Mkwawa"
        ]
      },
      7: {
        id: "HLO1_S7",
        title: "The slave trade in Africa and the Middle East (1500-1900)",
        content: [
          "Reasons for expansion of Atlantic slave trade from 16th century: technological factors",
          "Growth of maritime commerce; impact of plantation agriculture",
          "Existing practice of slavery in African societies; rivalries and warfare between African states",
          "Reasons for expansion of East African slave trade from late 18th century",
          "Existing slave trade between Arabia and Swahili coast; expansion of Sultanate of Oman",
          "Nature of slave trade: social and economic impact in Africa and Middle East",
          "Causes of decline of Atlantic slave trade: industrialization; abolitionist movement; legitimate commerce",
          "Causes of decline of East African slave trade: humanitarian factors; missionaries; colonial expansion",
          "Impact of anti-slavery Acts in 19th century: 1807 Slave Trade Act; 1833 Abolition Act; 1885 Berlin Act"
        ]
      },
      8: {
        id: "HLO1_S8",
        title: "European imperialism and the partition of Africa (1850-1900)",
        content: [
          "Growth of European activity in Africa: opportunities from decline of Ottoman Empire",
          "Traders, missionaries and explorers; creeping colonization",
          "Economic causes of partition: economic weaknesses in Europe; raw materials; search for new markets",
          "Role of chartered companies",
          "Strategic causes: sea route to east; British actions in Egypt and South Africa",
          "Other causes: national rivalry; humanitarian factors",
          "African background to partition: military, technological and administrative weaknesses",
          "German annexation: factors facilitating; Berlin West Africa Conference and impact",
          "Activities of King Leopold II of Belgium and De Brazza in Congo region"
        ]
      },
      9: {
        id: "HLO1_S9",
        title: "Response to European imperialism (1870-1920)",
        content: [
          "Factors influencing decisions to resist: determination to preserve independence; brutality of colonizing power",
          "Political structures; military strength; access to firearms",
          "Ethiopian resistance under Menelik II: reasons for success",
          "Mandinka resistance to French rule: reasons for success and failure",
          "Herero and Nama resistance in Namibia: reasons for failure",
          "Cetshwayo and conquest of Zulu kingdom",
          "Asante Wars (1873, 1896, 1900): reasons for resistance and British intervention",
          "Factors influencing collaboration: pragmatism; willingness to negotiate; social, political and economic gains",
          "Collaboration: Lewanika and Khama with British",
          "Resistance and collaboration in Buganda: Kabaka Mwanga and Apolo Kagwa"
        ]
      },
      10: {
        id: "HLO1_S10",
        title: "Africa under colonialism (1890-1980)",
        content: [
          "British rule in Kenya: colonial administration; economic and social development to 1963",
          "Tanganyika under German and British rule to 1961",
          "Nyasaland, Northern Rhodesia and Southern Rhodesia under British rule to 1965",
          "Creation and collapse of Central African Federation; Ian Smith and UDI",
          "Angola/Mozambique under Portuguese rule: economic and social development to 1975",
          "Nigeria: direct and indirect rule; factors promoting choice of administrative system",
          "Economic and social development; regional rivalries; constitutional developments to 1960",
          "Gold Coast: colonial administration; economic, social and political development to 1957",
          "Senegal: colonial administration; economic, social and political development to 1960"
        ]
      },
      11: {
        id: "HLO1_S11",
        title: "20th-century nationalist and independence movements in Africa",
        content: [
          "Angola: liberation war; MPLA and UNITA to independence in 1975",
          "South-West Africa: SWAPO to independence for Namibia in 1990",
          "Kenya: trade unions; Mau Mau; Jomo Kenyatta and KANU to 1963",
          "Gold Coast to Ghana: Nkrumah and Convention People's Party to independence in 1957",
          "French West Africa: nationalism, political parties and independence in Senegal in 1960",
          "Tanganyika: Tanganyika African National Union; Julius Nyerere to 1961",
          "Comparative analysis of factors leading to earlier or later independence",
          "Role of internal and external factors; nationalist movements; political parties and leaders",
          "Response of colonial powers; peaceful negotiations vs armed struggle"
        ]
      },
      12: {
        id: "HLO1_S12",
        title: "The Ottoman Empire (c1800-1923)",
        content: [
          "Challenges to Ottoman power in early 19th century: Greek War of Independence; Muhammad Ali in Egypt",
          "Eastern Question: European challenges and Ottoman responses; Crimean War",
          "Causes and outcomes of 19th-century crises in Balkans",
          "Decline of Ottoman power in Middle East and North Africa: Egypt, Libya, Algeria; Lebanon",
          "Attempts at internal reform and modernizations: causes, aims and effects of Tanzimat reforms",
          "Abdul Hamid—reaction and reform",
          "Growth of Committee of Union and Progress to 1908-1909; reforms of Young Turks",
          "Balkan Wars (1912 and 1913)",
          "Ottoman Empire in First World War: reasons for entry; impact of war; rise of Ataturk and collapse"
        ]
      },
      13: {
        id: "HLO1_S13",
        title: "War and change in the Middle East and North Africa 1914-1945",
        content: [
          "Allied diplomacy in Middle East: McMahon-Hussein correspondence; Sykes-Picot; Arab Revolt; Balfour Declaration",
          "Effects of Paris peace treaties: territorial and political impact; mandate system",
          "British and French administration in Iraq, Transjordan, Syria and Lebanon",
          "Egypt after First World War: nationalism; emergence of Wafd Party; Declaration of Independence; British influence",
          "Palestine mandate: economic, social and political developments; impact of Jewish immigration and settlement",
          "British responses and policies",
          "Ataturk and Turkish Republic: aims and policies; impact on Turkish society; successes and failures",
          "Case study on Iran, Saudi Arabia or North African state: economic, political and social developments; western influences; modernization"
        ]
      },
      14: {
        id: "HLO1_S14",
        title: "Africa, international organizations and the international community (20th century)",
        content: [
          "League of Nations: Abyssinian Crisis (1934-1936); causes and consequences of League failure",
          "Organization of African Unity (OAU): objectives, structure, successes and failures",
          "Regional organizations: East African Community (1967-1977); ECOWAS; SADCC/SADC; successes and failures",
          "Africa and UN: Congo, Mozambique, Somalia and Rwanda: reasons for successes and failures; wider impact",
          "UN specialized agencies: case study of impact of any two agencies",
          "Cold War and impact on Africa: case study of impact on any two African countries",
          "Africa's role in international diplomacy and peacekeeping",
          "Economic cooperation and development initiatives"
        ]
      },
      15: {
        id: "HLO1_S15",
        title: "Developments in South Africa 1880-1994",
        content: [
          "Discovery of diamonds and gold: political, social and economic consequences",
          "South African War (1899-1902): causes—economic, political, strategic; course and consequences",
          "Treaty of Vereeniging and developments leading to Act of Union (1909)",
          "Policies of Smuts and Hertzog (1910-1948); segregation, discrimination and protest",
          "National Party: reasons for 1948 election victory; nature and impact of apartheid policies of Malan",
          "Verwoerd and Grand Apartheid: Bantustan system",
          "Resistance to apartheid: radicalization; ANC; Sharpeville and decision to adopt armed struggle",
          "Steve Biko and Black Consciousness movement; Soweto massacre; township unrest in 1980s",
          "International opposition to apartheid: impact of economic boycott",
          "End of apartheid system: De Klerk's lifting of ban on ANC; release of Mandela; role in transition to democracy; CODESA; 1994 elections"
        ]
      },
      16: {
        id: "HLO1_S16",
        title: "Social and cultural developments in Africa in the 19th and 20th centuries",
        content: [
          "Factors promoting and inhibiting spread of Islam and Christianity in Africa in 19th and 20th centuries",
          "African Independent Churches movement; reasons for creation and growth of Africanist churches",
          "Changing social and cultural values",
          "Changing role of women",
          "Social and cultural impact of technological developments",
          "Impact of immigration and emigration",
          "Impact of colonialism on art and culture",
          "Developments in education",
          "Case study approach using any two African countries for final six bullet points"
        ]
      },
      17: {
        id: "HLO1_S17",
        title: "Post-war developments in the Middle East (1945-2000)",
        content: [
          "Origins of state of Israel: post-war tensions and instability in mandate; causes and effects of 1948-1949 War",
          "Arab-Israeli conflicts: Suez Crisis, Six Day War, 1973 War; effects—occupied territories, intifadas, PLO",
          "Attempts at peacemaking up to and including Camp David (2000)",
          "Post-war Egypt: Nasser, Sadat, Mubarak—political developments; economic and social policies",
          "Pan-Arabism and United Arab Republic (UAR)",
          "Post-war Iran: modernization and westernization under Mohammad Reza Shah Pahlavi; western influence",
          "White Revolution; origins and effects of 1979 Revolution; post-revolution Iran and effects of Iran-Iraq War",
          "Lebanon: civil wars; outside interference and reconstruction; Confessional state; economic, religious and social tensions; growth of militias and PLO"
        ]
      },
      18: {
        id: "HLO1_S18",
        title: "Post-independence politics in Africa to 2005",
        content: [
          "Causes of ethnic conflict, civil war and military intervention: ethnic tensions, economic problems",
          "Destabilization by outside forces, inefficiency of civilian governments, ideology, and personal ambition",
          "Impact of ethnic conflict, civil war and military intervention; impact of military rule",
          "Social and economic challenges: disease, illiteracy, poverty, famine; neo-colonial economic exploitation",
          "Establishment of single-party states; reasons including personal ambition, failure of democracy, need for effective government",
          "Return to multi-party democracy in 1980s and 1990s: reasons for successes and failures",
          "Economic growth and development to 2005: reasons for growth including political stability and multi-partyism",
          "Leadership; infrastructural development; investment; economic reforms",
          "Case study approach using any two African countries for all six bullet points"
        ]
      }
    }
  },
  HLO2: {
    id: "HLO2",
    title: "History of the Americas",
    sections: {
      1: {
        id: "HLO2_S1",
        title: "Indigenous societies and cultures in the Americas (c750-1500)",
        content: [
          "Types of political organization: non-sedentary, semi-sedentary, confederations and empires",
          "Role of local and state authorities",
          "Role of warfare in maintaining and expanding political organization",
          "Economic and social structures: role and nature of tribute; landholding; agricultural production",
          "Systems of exchange; nature of tribute in societies without money",
          "Religion: polytheistic beliefs; relationship between religious and political powers",
          "Relationship between man and nature",
          "Culture: written and unwritten language; contributions to scientific development and arts",
          "Case study approach using any two indigenous societies for last three bullets"
        ]
      },
      2: {
        id: "HLO2_S2",
        title: "European explorations and conquests in the Americas (c1492-c1600)",
        content: [
          "Exploration and conquest in North America: Columbus; conquest of Caribbean",
          "French and British exploration in North America",
          "Exploration and conquest in Latin America: Cortés and conquest of Aztecs; reasons for Spanish success and Aztec defeat",
          "Pizarro and conquest of Incas; later defeat of Manco Inca; reasons for Spanish success and Inca defeat",
          "Economic impact of exploration and conquest: exploitation of resources; acquisition of gold and silver",
          "Fur trade; tobacco trade; 'Columbian Exchange'",
          "Treatment of indigenous populations; Laws of Burgos (1512), Bartolomé de las Casas, New Laws of Indies (1542)",
          "Assimilation; eradication; social stratification; use of indigenous labour; women; multiracial issues",
          "European rivalries; Treaty of Tordesillas (1494); conflicting land claims based upon exploration; impact of conflicting claims"
        ]
      },
      3: {
        id: "HLO2_S3",
        title: "Colonial government in the New World (1500-1800)",
        content: [
          "Political organization in Spanish and Portuguese America: viceroyalty system, captaincy system",
          "Habsburg and early Bourbon rule; Braganza rule",
          "Political organization in British and French North America: corporate, royal and proprietary; charters",
          "Colonial American economies; encomienda, yanaconaje and mita; plantations; organization of trade",
          "Mercantilism; role of gold, silver and sugar",
          "Bourbon reforms and Pombaline reforms: reasons, nature and impact",
          "Limits of state power and resistance to authority",
          "Anglo-French rivalry in North America to 1763; Anglo-French relationships and alliances with indigenous peoples",
          "French and Indian Wars"
        ]
      },
      4: {
        id: "HLO2_S4",
        title: "Religion in the New World (1500-1800)",
        content: [
          "Aims of Catholic church in Spanish and Portuguese America; social, political and cultural impact",
          "Resistance of indigenous populations to Christianization",
          "Jesuits, Franciscans and Dominicans in Spanish and Portuguese America: economic and political organization",
          "Relations with indigenous populations; challenges to government authority",
          "Indigenous religions and Christianity; syncretism",
          "Religious tolerance and intolerance in British North America: Puritans, Quakers, Anglicans and Catholics",
          "Great Awakening c1720-c1760; social and political impact",
          "Religion in New France: Black Robes, Jesuits and Recollects"
        ]
      },
      5: {
        id: "HLO2_S5",
        title: "Slavery and the New World (1500-1800)",
        content: [
          "Reasons for, and origins of, slavery",
          "Role of colonial powers in establishment and expansion of slavery; asiento system",
          "Economic and social impact of slavery",
          "Middle Passage: living and working conditions in New World; social structures on plantations",
          "West Indies, Brazil and southern colonies of British America",
          "Slave resistance and slave rebellions in British America, including case study of specific rebellion",
          "Opposition to slave trade and slavery: Quakers and other early abolitionists"
        ]
      },
      6: {
        id: "HLO2_S6",
        title: "Independence movements (1763-1830)",
        content: [
          "Independence movements in Americas: political, economic, social and religious causes",
          "Influence of Enlightenment ideas; role of foreign intervention; conflicts and issues leading to war",
          "Political, intellectual and military contributions of leaders to process of independence: Washington, Bolívar and San Martín",
          "United States: processes leading to Declaration of Independence; influence of ideas; nature of declaration",
          "Military campaigns/battles and their impact on outcome",
          "Latin America: characteristics of independence processes; reasons for similarities and differences in two Latin American countries",
          "Military campaigns/battles and their impact on outcome",
          "Attitude of United States towards Latin American independence; nature of, and reasons for, Monroe Doctrine",
          "Impact of independence on two economies and societies of Americas: economic cost of wars of independence",
          "Establishment of new trade relations; impact on different social groups—specifically indigenous peoples, African Americans, Creoles"
        ]
      },
      7: {
        id: "HLO2_S7",
        title: "Nation-building and challenges (c1780-c1870)",
        content: [
          "United States: Articles of Confederation; provisions and philosophical underpinnings of 1787 Constitution",
          "Major compromises and changes in US political system",
          "Latin America: challenges to establishment of political systems; nature of caudillo rule",
          "Regional conditions leading to its establishment; policies and impact of caudillo rule in one country",
          "War of 1812: causes and impact on British North America and United States",
          "Mexican-American War (1846-1848): causes and effects on region",
          "Canada: causes and effects of 1837 rebellions; Durham report and implications; challenges to Confederation",
          "British North America Act of 1867—compromises, unresolved issues, regionalism, effects"
        ]
      },
      8: {
        id: "HLO2_S8",
        title: "US Civil War: causes, course and effects (1840-1877)",
        content: [
          "Slavery: cotton economy and slavery; conditions of enslavement; adaptation and resistance",
          "Abolitionist debate—ideological, legal, religious and economic arguments for and against slavery, and their impact",
          "Origins of Civil War: Nullification Crisis; states' rights; sectionalism; slavery; political issues",
          "Economic differences between North and South",
          "Reasons for, and effects of, westward expansion and sectional debates; crises of 1850s",
          "Compromise of 1850; political developments, including Lincoln-Douglas debates and presidential election of 1860",
          "Union versus Confederate: strengths and weaknesses; economic resources; role and significance of leaders during Civil War",
          "Role of Lincoln; significant military battles/campaigns",
          "Factors affecting outcome of Civil War; role of foreign relations; Emancipation Proclamation (1863) and participation of African Americans",
          "Reconstruction: presidential and congressional plans; methods of southern resistance; economic, social and political successes and failures"
        ]
      },
      9: {
        id: "HLO2_S9",
        title: "The development of modern nations (1865-1929)",
        content: [
          "Causes and consequences of railroad construction; industrial growth, urbanization and economic modernization",
          "Development of international and inter-American trade; neocolonialism and dependency",
          "Causes and consequences of immigration; emigration and internal migration, including impact upon, and experience of, indigenous peoples",
          "Development and impact of ideological trends, including progressivism, Manifest Destiny, liberalism, nationalism, positivism, social Darwinism, 'indigenismo' and nativism",
          "Social and cultural changes: developments in arts; changes in role of women",
          "Influence of leaders in transition to modern era: political and economic aims; successes and failures of Theodore Roosevelt, Wilfrid Laurier and any one Latin American leader",
          "Social, economic and legal conditions of African Americans between 1865 and 1929; New South",
          "Legal issues, black codes, Jim Crow Laws and Plessy v. Ferguson; search for civil rights and ideas, aims and tactics of Booker T Washington, W E B Du Bois and Marcus Garvey",
          "Great Migration and Harlem Renaissance",
          "Case study approach using two countries from region for first four bullets"
        ]
      },
      10: {
        id: "HLO2_S10",
        title: "Emergence of the Americas in global affairs (1880-1929)",
        content: [
          "United States' expansionist foreign policies: political, economic, social and ideological reasons",
          "Spanish-American War (1898): causes and effects",
          "Impact of United States' foreign policies: Big Stick; Dollar Diplomacy; moral diplomacy",
          "United States and First World War: from neutrality to involvement; reasons for US entry",
          "Wilson's peace ideals and struggle for ratification of Treaty of Versailles in United States",
          "Significance of war for United States' hemispheric status",
          "Involvement of one country of Americas (except US) in First World War: nature of, and reasons for, involvement",
          "Impact of First World War on any two countries of Americas: economic, political, social and foreign policies"
        ]
      },
      11: {
        id: "HLO2_S11",
        title: "The Mexican Revolution (1884-1940)",
        content: [
          "Rule of Porfirio Díaz from 1884; political control; contribution to discontent",
          "Causes of Mexican Revolution: social, economic and political",
          "Revolution and its leaders (1910-1917): ideologies, aims and methods of Madero, Villa, Zapata, Carranza",
          "Achievements and failures; 1917 Constitution—nature and application",
          "Construction of post-revolutionary state (1920-1940): Obregón, Calles and Maximato",
          "Challenges; assessment of their impact in post-revolutionary state",
          "Lázaro Cárdenas and renewal of revolution (1934-1940): aims, methods and achievements",
          "Role of foreign powers (especially United States) in outbreak and development of Mexican Revolution",
          "Motivations, methods of intervention and contributions",
          "Impact of revolution on women, arts, education and music"
        ]
      },
      12: {
        id: "HLO2_S12",
        title: "The Great Depression and the Americas (mid 1920s-1939)",
        content: [
          "Great Depression: political and economic causes in Americas",
          "Nature and efficacy of solutions in United States: Hoover; Franklin D Roosevelt and New Deal",
          "Critics of New Deal; impact of New Deal on US political and economic systems",
          "Nature and efficacy of solutions in Canada: Mackenzie King and RB Bennett",
          "Impact of Great Depression on Latin America; political instability and challenges to democracy",
          "Economic and social challenges",
          "Latin American responses to Great Depression: import substitution industrialization (ISI)",
          "Social and economic policies; popular mobilization and repression",
          "Impact of Great Depression on society: specifically impact on women and minorities",
          "Impact of Great Depression on arts and culture",
          "Case study approach using one country from region for last three bullets"
        ]
      },
      13: {
        id: "HLO2_S13",
        title: "The Second World War and the Americas (1933-1945)",
        content: [
          "Hemispheric reactions to events in Europe and Asia: inter-American diplomacy; cooperation and neutrality",
          "Franklin D Roosevelt's Good Neighbor policy—its application and effects",
          "Involvement of any two countries of Americas in Second World War",
          "Social impact of Second World War; impact on women and minorities; conscription",
          "Treatment of Japanese Americans, Japanese Latin Americans and Japanese Canadians",
          "Reasons for, and significance of, US use of atomic weapons against Japan",
          "Economic and diplomatic effects of Second World War in any two countries of Americas"
        ]
      },
      14: {
        id: "HLO2_S14",
        title: "Political developments in Latin America (1945-1980)",
        content: [
          "Cuban Revolution: political, social and economic causes",
          "Rule of Fidel Castro: Cuban nationalism; political, economic, social and cultural policies",
          "Treatment of opposition; successes and failures; impact on region",
          "Populist leaders in two countries: rise to power and legitimacy; ideology",
          "Social, economic and political policies; successes and failures; treatment of opposition",
          "Democracy in crisis: political, social and economic reasons for failure of elected leaders",
          "Rise of military dictatorship in one country: reasons for their rise to power",
          "Economic and social policies; repression and treatment of opposition",
          "Guerrilla movements in one country: origins, rise and consequences",
          "Liberation theology in Latin America: origins, growth and impact"
        ]
      },
      15: {
        id: "HLO2_S15",
        title: "Political developments in the United States (1945-1980) and Canada (1945-1982)",
        content: [
          "Truman and Fair Deal; domestic policies of Eisenhower",
          "Kennedy and New Frontier; Johnson and Great Society",
          "Nixon's domestic policies; Watergate and possible impeachment; Ford's domestic policies and pardon of Nixon",
          "Carter's domestic policies; changes and internal conflicts within Democratic and Republican parties in 1960s and 1970s, and impact on elections",
          "Domestic policies of Canadian prime ministers: St Laurent, Diefenbaker; political stability and nationalism",
          "Social and political change under Pearson and Trudeau",
          "Causes and effects of Quiet Revolution; rise of Quebec nationalism, Front de Libération du Québec (FLQ) and October Crisis of 1970"
        ]
      },
      16: {
        id: "HLO2_S16",
        title: "The Cold War and the Americas (1945-1981)",
        content: [
          "Truman: containment and its implications for Americas; rise of McCarthyism and its effects on domestic and foreign policies of United States",
          "Social and cultural impact of Cold War on Americas",
          "Korean War, United States and Americas: reasons for participation; military developments; diplomatic and political outcomes",
          "Eisenhower and Dulles: New Look and its application; characteristics and reasons for policy; short-term and long-term impact on region",
          "United States' involvement in Vietnam: reasons for, and nature of, involvement at different stages",
          "Domestic effects and end of war; Canadian non-support of war; Latin American protest against war",
          "United States' foreign policies from Kennedy to Carter: characteristics of, reasons for, and successes and failures of policies",
          "Implications for region: Kennedy's Alliance for Progress; Nixon's covert operations and Chile; Carter's quest for human rights and Panama Canal Treaty (1977)",
          "Cold War in one country of Americas (except US): reasons for foreign and domestic policies and their implementation"
        ]
      },
      17: {
        id: "HLO2_S17",
        title: "Civil rights and social movements in the Americas post-1945",
        content: [
          "Indigenous peoples and civil rights in Americas",
          "African Americans and civil rights movement: origins, tactics and organizations; US Supreme Court and legal challenges to segregation in education",
          "Ending of segregation in south (1955-1980)",
          "Role of Dr Martin Luther King Jr in civil rights movement; rise of radical African American activism (1965-1968)—Black Panthers, Black Power and Malcolm X",
          "Role of governments in civil rights movements in Americas",
          "Feminist movements in Americas; reasons for emergence; impact and significance",
          "Hispanic American movement in United States; Cesar Chavez; immigration reform",
          "Youth culture and protests of 1960s and 1970s: characteristics and manifestation of counter-culture"
        ]
      },
      18: {
        id: "HLO2_S18",
        title: "The Americas (1980-2005)",
        content: [
          "United States: domestic policies of presidents Reagan, GHW Bush and Clinton; effects on United States; impact upon region",
          "Continuities and changes in US foreign policy: Reagan, GHW Bush and Clinton; from bipolar to unilateral power; impact on region",
          "Canadian domestic policies: Mulroney governments (1984-1993), collapse of Progressive Conservative Party",
          "Chrétien in power (1993-2003), Quebec and separatism",
          "Transition to democracy in two countries of Latin America: reasons for democratization; role of internal and external factors",
          "Post-transition challenges in two countries of Latin America: economic challenges and debt; justice and reconciliation; political parties and role of military",
          "Violent and non-violent movements in two countries of Latin America: causes, aims and impact; role of religion, including liberation theology",
          "Economic and political cooperation in Americas: reasons for and impact",
          "Terrorism: challenges and impact on region; 9/11 (attacks on US on 11 September 2001)"
        ]
      }
    }
  },
  HLO3: {
    id: "HLO3",
    title: "History of Asia and Oceania",
    sections: {
      1: {
        id: "HLO3_S1",
        title: "Trade and exchange: The Silk Road in the medieval world (750-1500)",
        content: [
          "Silk Road under Tang dynasty",
          "Connecting west and east: interregional trade; travellers and explorers; merchants; missionaries and pilgrims",
          "Ibn Battuta and Marco Polo",
          "Increase in trade under Mongol Empire: role of Mongol expansion and empire in re-establishing and increasing trade",
          "Establishment of political centres of Mongol Empire; Tamerlane (Timur); Samarkand",
          "Political and cultural integration: connection of previously isolated nomadic societies; political unification of zones",
          "Cultural interaction and exchange: transmission of religious ideas and art",
          "Decline in 15th century: causes of decline; rise in seaborne trade; fragmentation and loosening of political, cultural and economic unity after end of Mongol Empire"
        ]
      },
      2: {
        id: "HLO3_S2",
        title: "Japan in the Age of the Samurai (1180-1333)",
        content: [
          "Gempei War (1180-1185), its causes and consequences, and establishment of Kamakura Shogunate",
          "Expanding role of samurai under Minamoto; rising military and economic power; replacement of court government with samurai",
          "Role in developing law",
          "Struggles between samurai clans",
          "Establishment of first samurai-dominated government; declining power of emperor",
          "Samurai life: samurai ethos/ethical code; focus on group loyalty and discipline; influence of Buddhism",
          "Samurai weapons and armour; role of samurai women",
          "Impact of samurai on Japanese society and culture",
          "Mongol invasions of Japan and kamikaze storms (1274 and 1281)"
        ]
      },
      3: {
        id: "HLO3_S3",
        title: "Exploration, trade and interaction in East Asia and South-East Asia (1405-1700)",
        content: [
          "China 'looking out': Chinese shipbuilding programme; 'treasure ships'; construction of imperial fleet",
          "Voyages of Zheng He; increased overseas trade",
          "Japan 'looking out': trade links established with Portugal (1543); arrival of traders from other European countries; missionaries",
          "Significance and impact of beginnings of Indo-European trade: Vasco da Gama (1498); capture of Malacca (1511); Magellan's journey (1519)",
          "Reasons for, and impact of, expeditions, and nature of settlements, of Spanish, Portuguese, French, Dutch and British",
          "Impact of European settlements on indigenous people; social, religious and cultural exchange; demographic and territorial changes",
          "China 'turning in': increased Chinese isolationism; isolationist policies; restrictions on ships, including destruction of ocean-going ships (1525)",
          "Japan 'turning in': Japanese isolationism in 17th century; sakoku (closed country policy) restrictions on foreigners entering Japan and Japanese leaving Japan",
          "Strict regulations on trade and commerce; creation of four 'gateways'",
          "Social, political and economic impact of isolation on China and Japan"
        ]
      },
      4: {
        id: "HLO3_S4",
        title: "The rise and fall of the Mughal Empire (1526-1712)",
        content: [
          "Origins and rise of Mughal power: Babur and Humayun",
          "Consolidation of Mughal rule in subcontinent: domestic, military, religious, economic and cultural policies",
          "Significance of individual rulers for Mughal Empire: Akbar, Shah Jahan I and Aurangzeb",
          "Impact of religious cooperation and conflict in Mughal Empire",
          "Reasons for, and effects of, domestic opposition",
          "Social, cultural and economic achievements",
          "Role of internal and external forces in decline of Mughal Empire"
        ]
      },
      5: {
        id: "HLO3_S5",
        title: "Colonialism and the development of nationalism in South-East Asia (c1750-1914)",
        content: [
          "Political structure and economic, social and cultural effects of Dutch colonial system in Dutch East Indies",
          "Beginnings of nationalism; Culture System (Cultivation System); Liberal Policy; decline of Dutch East India Company (VOC)",
          "Increasing Dutch state control and introduction of Ethical Policy (1901)",
          "Political structure and economic, social and cultural effects of French colonial system in Indo-China",
          "Beginnings of nationalism; factors that led to formation of French Indo-China (1887)",
          "Political structure and economic, social and cultural effects of Spanish colonial system in Philippines",
          "Beginnings of nationalism; causes and results of Philippine Revolution (1896); significance of Rizal, Bonifacio and Aguinaldo",
          "Philippines and United States: Spanish-American War (1898); colonial rule by United States",
          "Siamese monarchy; internal and external factors that maintained independence; Rama IV (Mongkut), Rama V (Chulalongkorn)"
        ]
      },
      6: {
        id: "HLO3_S6",
        title: "India, Afghanistan and Burma (1750-1919)",
        content: [
          "Expansion of British East India Company: Battle of Plassey (1757); Anglo-Maratha Wars; Anglo-Mysore Wars",
          "Economic, social and cultural effects of British colonial system in India; role of British East India Company (1773-1857)",
          "Impact of policies of Bentinck and Dalhousie",
          "Causes of Great Revolt (Indian Mutiny) of 1857; political, social and economic consequences of Great Revolt",
          "Key developments 1858-1914: Government of India Act 1858; partition of Bengal (1905); Indian Councils Act 1909 (Morley-Minto reforms)",
          "Outbreak of First World War; social and economic impact of British Raj",
          "Development and significance of constitutional groups; growth of national consciousness; Indian National Congress (1885) and All India Muslim League (1906)",
          "Afghanistan: Russo-British rivalry; 'Great Game'; North-West frontier; First, Second and Third Anglo-Afghan Wars; policies of Afghan monarchy; resistance to British influence",
          "Burma: King Mindon; King Thibaw; reasons for loss of independence; First, Second and Third Anglo-Burmese Wars; economic, social and cultural effects of British colonial system in Burma; rise of resistance and nationalism"
        ]
      },
      7: {
        id: "HLO3_S7",
        title: "Challenges to traditional East Asian societies (1700-1868)",
        content: [
          "Nature and structure of imperial rule under Qing dynasty; Qianlong",
          "Causes and effects of internal challenges; White Lotus Rebellion",
          "Chinese tribute system and western trade missions",
          "Causes and consequences of First and Second Opium Wars; unequal treaties",
          "Taiping Rebellion: reasons for rise and fall of Taiping Heavenly Kingdom; consequences for Chinese society",
          "Society and economy of Tokugawa Shogunate's rule in Japan: changes and reasons for discontent",
          "Political, social and economic crisis of Bakumatsu period (1853-1868): impact of Commodore Perry's expedition",
          "Reasons for fall of Tokugawa Shogunate"
        ]
      },
      8: {
        id: "HLO3_S8",
        title: "British colonialism and emerging national identities in Oceania (1788-1919)",
        content: [
          "Indigenous societies and impact of early colonial settlements; Treaty of Waitangi (1840)",
          "Settlement schemes; immigration to Australia and New Zealand; early colonial settlements; land distribution",
          "Pastoral society; squatters and Selection Acts",
          "Reasons for, and impact of, tensions between indigenous people and settlers",
          "Social and economic impact of gold rushes; growth of cities; emergence of labour movement",
          "Constitutional developments; growth of national identity; federation movement; National Australasian Conventions",
          "Achievement of dominion status in Australia (1901) and New Zealand (1907)",
          "Political, social and economic impact of First World War on Australia and New Zealand; Australian and New Zealand Army Corps (ANZACs); significance of Gallipoli",
          "Nature and impact of British administration in Pacific Islands"
        ]
      },
      9: {
        id: "HLO3_S9",
        title: "Early modernization and imperial decline in East Asia (1860-1912)",
        content: [
          "Tongzhi Restoration and Self-Strengthening Movement (1861-1894); Prince Gong; Cixi",
          "Impact of defeat in Sino-Japanese War (1894-1895); Guangxu and Hundred Days' Reform (1898)",
          "Boxer Rebellion (1900-1901); late Qing reforms (1901-1911)",
          "Sun Yixian and causes of 1911 Xinhai Revolution; reasons for its failure",
          "Reasons for Meiji Restoration (1868) in Japan; 1889 Constitution",
          "Social, cultural and economic developments in Meiji Japan",
          "Rise of Japanese military power: victory in Sino-Japanese War (1894-1895) and Russo-Japanese War (1904-1905); impact on region",
          "Korean isolation: Queen Min; opening (1876); Tonghak Rebellion (1894); Japanese annexation (1910)"
        ]
      },
      10: {
        id: "HLO3_S10",
        title: "Nationalism and independence in India (1919-1964)",
        content: [
          "Significance of key political developments, including: aftermath of First World War; Amritsar massacre (1919)",
          "Government of India Act 1919; Simon Commission (1928); Round Table Conferences (1930-1932); response to Government of India Act 1935",
          "Role and importance of key groups and individuals: Indian National Congress and All India Muslim League; Mohandas (Mahatma) Gandhi; Jawaharlal Nehru; Jinnah",
          "Struggle for independence; non-cooperation movement; civil disobedience campaigns; Salt March (1930); Quit India campaign (1942)",
          "Growth of Muslim separatism; 'Two-Nation' theory; Lahore Resolution (1940)",
          "Impact of Second World War: Subhas Chandra Bose; Cripps Mission (1942); weakening of British power; Mountbatten",
          "Achievement of independence; reasons for partition of South Asian subcontinent (1947)",
          "Post-independence India: ethnic and religious conflicts; princely states; Kashmir; successes and failures of Nehru's domestic policies"
        ]
      },
      11: {
        id: "HLO3_S11",
        title: "Japan (1912-1990)",
        content: [
          "Impact of First World War and post-war conferences: Paris peace conference (1919); Washington Naval Conference (1921-1922)",
          "Taisho democracy: growth of liberal values and two-party system",
          "Reasons for, and impact of, rise of militarism and extreme nationalism: increasing influence of army in politics; political coups and assassinations",
          "Invasions of Manchuria (1931) and China (1937), and impact on relations with West; Three Party/Tripartite Pact (1940); US embargo (1940)",
          "Japan and Pacific War (1941-1945): decision to attack Pearl Harbor; initial successes; reasons for defeat",
          "US occupation (1945-1952): social, political and cultural changes; reverse course (1950)",
          "Reasons for Japan's 'economic miracle'; social, cultural and economic impact of globalization"
        ]
      },
      12: {
        id: "HLO3_S12",
        title: "China and Korea (1910-1950)",
        content: [
          "Rise of national identity in China: Yuan Shikai; Sun Yixian; 21 Demands (1915); New Culture Movement",
          "Treaty of Versailles (1919); May Fourth Movement (1919); effects of warlordism",
          "Nationalist rule of China: Guomindang leadership and ideology; Jiang Jieshi; successes and failures of domestic policy during Nanjing decade (1927-1937)",
          "Political, economic and social reasons for rise of communism in China to 1936: condition of peasantry; First United Front; Shanghai massacre (1927)",
          "Jiangxi Soviet (1931-1934); Long March (1934-1935); Yan'an Soviet; leadership of Mao Zedong",
          "Political, military and social impact of Sino-Japanese War (1937-1945); Chinese Civil War (1946-1949) and communist victory: political, economic and military factors",
          "Impact of Japanese rule of Korea—social, political and economic effects of annexation (1910); impact of Sino-Japanese War on Korea",
          "Japanese use of forced labour, conscription and comfort women; division of Korea at 38th parallel (1945)",
          "Taiwan and Republic of China (ROC): establishment of Jiang Jieshi's rule; martial law; White Terror; beginnings of Taiwanese independence movement"
        ]
      },
      13: {
        id: "HLO3_S13",
        title: "Impact of the Second World War on South-East Asia",
        content: [
          "Reasons for, and effects of, initial Japanese victories in South-East Asia (1940-1942)",
          "Nature and impact of Japanese occupation",
          "Growth of nationalism and role of independence movements during war in Dutch East Indies; Indochina; Malaya: resistance and collaboration",
          "Emergence and influence of leaders: Sukarno; Ho Chi Minh; Tunku Abdul Rahman",
          "Reasons for Indonesian independence (1949)",
          "Case study on one country in South-East Asia (other than one already named in this section): political, social and economic effects of Second World War"
        ]
      },
      14: {
        id: "HLO3_S14",
        title: "The People's Republic of China (1949-2005)",
        content: [
          "Consolidation of communist state (1949-1961) under Mao Zedong; key policies; land reforms; rectification campaigns; Hundred Flowers Campaign (1956)",
          "Transition to socialism; successes and failures in economic developments (1949-1961); First Five-Year Plan; Great Leap Forward (Second Five-Year Plan)",
          "Social developments; women's rights; health; education",
          "Great Proletarian Cultural Revolution: causes; Gang of Four; political, social and cultural impact",
          "Foreign policy and foreign affairs 1949-1976: Sino-American relations; establishment and breakdown of Sino-Soviet relations; China as regional and global power",
          "Power struggle following death of Mao Zedong: Hua Guofeng, re-emergence of Deng Xiaoping and defeat of Gang of Four",
          "China under Deng Xiaoping (1976-1997); economic developments; Four Modernizations; political developments; causes and effects of Tiananmen Square (1989); Jiang Zemin"
        ]
      },
      15: {
        id: "HLO3_S15",
        title: "Cold War conflicts in Asia",
        content: [
          "Malayan Emergency (1948-1960): Malayan Communist Party (MCP); British/Commonwealth response; nature of conflict; resolution and legacy",
          "Korean War (1950-1953): causes; nature of conflict; international responses; outcome; economic and political impact on Korean peninsula",
          "Vietnam: League for Independence of Vietnam (Viet Minh); Ho Chi Minh; French Indo-China War (1946-1954)",
          "Vietnam War (1956-1975): causes; nature of conflict; international involvement; outcome; economic and political effects on Vietnam",
          "Cambodia: failures of Sihanouk's rule; Khmer Rouge ideology; Pol Pot; impact of Vietnam War",
          "Nature and impact of Khmer Rouge's regime; invasion by Vietnamese, and civil war; international response; 1993 elections",
          "Afghanistan: reasons for, and impact of, Soviet invasion (1979); nature of conflict; international involvement; withdrawal of Soviet troops (1989); civil war (1989-1992)"
        ]
      },
      16: {
        id: "HLO3_S16",
        title: "Developments and challenges in South Asia after 1947",
        content: [
          "Foreign policy and economic developments under Nehru: relationship between India and Pakistan; Indo-Pakistani Wars—1947, 1965, 1971; causes and results; independence of Bangladesh (1971)",
          "India: social, political and economic developments and challenges under Indira Gandhi, Rajiv Gandhi and Rao",
          "Pakistan 1947-1991: nation building; social, political and economic developments and challenges; friction between East and West Pakistan",
          "Cultural and linguistic differences; constitutional referendum (1991); Jinnah; Ayub Khan; Zulfikar Ali Bhutto; Zia-ul-Haq; Benazir Bhutto",
          "Bangladesh: nation building; social, political and economic developments and challenges",
          "Ceylon/Sri Lanka: nation building; social, political and economic developments and challenges; conflict between Sinhalese and Tamils; 1971 uprising; civil war; Sirimavo Bandaranaike"
        ]
      },
      17: {
        id: "HLO3_S17",
        title: "Developments in Oceania after the Second World War (1945-2005)",
        content: [
          "Social and cultural developments; changing role of women; growth of national identity",
          "Immigration to Australia and New Zealand after war, and development of multicultural societies",
          "Policies and achievements of governments in Australia: Curtin; Chifley; Menzies; Whitlam; Fraser; Hawke/Keating",
          "Policies and achievements of governments in New Zealand: Fraser; Holyoake; Muldoon; Lange; Bolger",
          "Attitudes and policies towards indigenous peoples in Australia and New Zealand",
          "Australia and New Zealand: foreign policy and international alignments",
          "Economic policies and realignment: Britain joining EEC (later European Union); rise of Asian economies",
          "Reasons for, and results of, emergence of independent Pacific Island states"
        ]
      },
      18: {
        id: "HLO3_S18",
        title: "Social, cultural and economic developments in Asia (excluding China, Japan and India) (1980-2005)",
        content: [
          "Impact of globalization: causes and effects of economic growth; technological development; urbanization; demographic changes",
          "Changes in standards of living; economic and social impact of tourist industry",
          "Immigration/emigration: causes and effects",
          "Social issues and developments: changes in social structures; gender roles; environment; education; health reforms; impact of technology on society",
          "Religion: role of religion in society; religious conflict and tensions",
          "Cultural change: nature of, and changes in, traditional arts and culture; cultural impact of globalization; nature and role of media",
          "Emergence of, and responses to, terrorism",
          "Case study approach using any two countries from Asia (excluding China, Japan and India)"
        ]
      }
    }
  },
  HLO4: {
    id: "HLO4",
    title: "History of Europe",
    sections: {
      1: {
        id: "HLO4_S1",
        title: "Monarchies in England and France (1066-1223)",
        content: [
          "Pre-Norman England and impact of Norman invasion",
          "Normans in England: William I, Duke of Normandy (King of England 1066-1087); establishment of authority",
          "Domestic and foreign policies; Domesday Book; Henry I (1100-1135)",
          "Angevin Commonwealth: Henry II (1154-1189); policies in England, Ireland and in Europe",
          "Duchy of Normandy and its relations with France: rivalry and wars between dukes of Normandy, as kings of England, and kings of France",
          "Role played by John, Richard I, Henry II and Philip II (Philip Augustus); effects in England and France",
          "Extension of royal demesne and power in France under Capetians (1108-1223); expansion of Capetian power under Louis VI, Louis VII and Philip II (Philip Augustus)",
          "Nature of their governments, and reasons for their success in expanding royal authority",
          "Comparison of nature of royal government in England and France"
        ]
      },
      2: {
        id: "HLO4_S2",
        title: "Muslims and Jews in medieval Europe (1095-1492)",
        content: [
          "Reasons for hostility to Muslims: Crusades; fear of Muslim power; Christian doctrine and teaching",
          "Reasons for Christian opposition to Muslim states in Spain: religious and economic motivations",
          "Results of conflict between Christian-ruled and Muslim-ruled states in Spain: warfare on borders between Christian and Muslim states",
          "Mediterranean and Balkans; loss of economic activity and cultural and intellectual diversity; growth of anti-Muslim feelings",
          "Role and contribution of Jews in medieval Europe: finance; trade; participation in scholarship and royal bureaucracy",
          "Reasons for persecution of Jews: religious hysteria during Crusades; official and/or popular anti-Semitism and scapegoating",
          "Belief in Jewish culpability for Black Death",
          "Impact of persecution of Jews: massacres; expulsion; segregation from society; loss of Jewish skill and ability in wider economic, intellectual and cultural life"
        ]
      },
      3: {
        id: "HLO4_S3",
        title: "Late medieval political crises (1300-1487)",
        content: [
          "Succession crises in England: Edward II (1307-1327); Richard II (1377-1399)",
          "Hundred Years War 1337-1360 and 1369-1389: causes, course, impact and significance",
          "Hundred Years War 1415-1453: reasons for re-emergence of war; importance of Aquitaine; reasons for outcome; impact in England and France",
          "Rise and fall of ducal Burgundy (1363-1477): Philip the Bold (Philip II); Philip the Good (Philip III); Charles the Bold",
          "Crisis of monarchy and challenges to royal authority in 15th-century England and France: Wars of Roses and War of Public Weal",
          "Nature of kingship and challenges: England—Henry VI (1422-1461); Edward IV (1461-1483); France—Louis XI (1461-1483)",
          "Wars of Roses: causes; events; impact on England, including impact on government and royal authority"
        ]
      },
      4: {
        id: "HLO4_S4",
        title: "The Renaissance (c1400-1600)",
        content: [
          "Origins, causes and development of Renaissance in Italy; social and political situation in Florence",
          "Forms of government in Italian city states: Milan; Florence; Venice",
          "Importance of patronage: role and significance of Lorenzo de Medici and Ludovico Sforza; papal patronage",
          "Impact of literature; political writings",
          "Northern Renaissance in Burgundy and Germany",
          "Case study of spread and impact of Renaissance to one European country not already mentioned in this section"
        ]
      },
      5: {
        id: "HLO4_S5",
        title: "The Age of Exploration and its impact (1400-1550)",
        content: [
          "Motives for exploration and reasons for its increase in 15th century: religion and exploration; national and personal rivalries",
          "Quest for knowledge; opening up of new trade routes for luxury goods",
          "Enablers of exploration: patronage, including role and significance of Henry the Navigator; developments in shipbuilding, cartography and navigation",
          "Portuguese exploration of west coast of Africa: significance; consequences for European states",
          "Exploration and New World: significance; consequences for European states",
          "Exploration and Indian Ocean: significance; consequences for European states",
          "Significance and impact of Treaty of Tordesillas (1494)",
          "Impact on Europe to 1550: economic impact on Europe; 'Columbian Exchange'"
        ]
      },
      6: {
        id: "HLO4_S6",
        title: "Aspects of the Reformation (c1500-1563)",
        content: [
          "State of Catholic church in Europe at start of 16th century: corruption, criticism and impact of Erasmus",
          "Religious ideas and impact of Luther: indulgences, Tetzel Mission and Ninety-Five Theses; response to Luther from Catholic church and Holy Roman Emperor",
          "Significance of Luther's three critical tracts (1520); relations with Melanchthon and Zwingli",
          "Reasons for successful spread of Lutheran ideas in Germany: printing press; role of Frederick the Wise; attitudes of princes and cities",
          "Imperial diets of Worms (1521) and Speyer (1526 and 1529)",
          "Religion and conflict in Germany: Knights' Revolt; Peasants' War; radical reformation; formation of Schmalkaldic League through to Peace of Augsburg (1555)",
          "Response of Catholic Church: spiritual movements; role of papacy (including Paul III, Paul IV and Pius IV); Roman Inquisition; Jesuits",
          "Clerical education and discipline; Council of Trent (1545-1563)"
        ]
      },
      7: {
        id: "HLO4_S7",
        title: "Absolutism and Enlightenment (1650-1800)",
        content: [
          "Scientific Revolution; goals and development of Enlightenment ideas",
          "Case study of Enlightenment ideas and their political impact in any two of Germany, England, Scotland, France, Spain, Dutch Republic or Italy",
          "Case study of any two absolutist monarchs: nature of their rule; extent of their power; foreign policy",
          "Case study of any two enlightened despots: policies and their impact; extent of change",
          "Social and economic change in Enlightenment era; growth of cities; agricultural change",
          "Monarchy, patronage and arts; Baroque movement"
        ]
      },
      8: {
        id: "HLO4_S8",
        title: "The French Revolution and Napoleon I (1774-1815)",
        content: [
          "Crisis of Ancien Régime: role of monarchy, specifically Louis XVI; intellectual, political, social, financial and economic challenges",
          "Monarchy to republic: causes and significance of Revolution; 1791 Constitution; fate of monarchy; terror; Robespierre; Thermidorean reaction",
          "Political, social and economic impact of Revolution; French revolutionary wars (1792-1799)",
          "Establishment of, nature of, and collapse of Directory (1795-1799)",
          "Rise and rule of Napoleon (1799-1815); impact of Napoleon's domestic and foreign policies on France",
          "Napoleonic Wars (1803-1815); collapse of Napoleonic Empire; military defeat; Hundred Days"
        ]
      },
      9: {
        id: "HLO4_S9",
        title: "France (1815-1914)",
        content: [
          "Bourbon restoration, Congress of Vienna and its impact on France",
          "Reigns of Louis XVIII and Charles X: politics and society (1815-1830)",
          "Revolution of 1830 and July Monarchy of Louis Philippe; reasons for collapse of July monarchy",
          "1848 Revolution: Second Republic, repression and emergence of Louis-Napoleon; establishment of Second Empire",
          "Napoleon III and Second Empire: domestic policies; stability; opposition; periods of reform; foreign policies, including Crimean War and interventions in Italy and Mexico",
          "Third Republic (1871-1914): stability and crises 1871-1890—problems in establishing Republic and Boulangisme; 1890-1914—Dreyfus, growth of political extremes, corruption"
        ]
      },
      10: {
        id: "HLO4_S10",
        title: "Society, politics and economy in Britain and Ireland (1815-1914)",
        content: [
          "Social protest (1815-1848): Peterloo; Chartism—reasons for emergence and failure; Peel and repeal of Corn Laws—reasons and consequences; Irish Famine",
          "Extension of franchise: reasons for, and consequences of, Reform Acts (1832, 1867 and 1884-1885); impact on political parties",
          "Victorian society c1840-c1900: condition of working class during Industrial Revolution; urban poverty, social reforms",
          "Disraeli, Gladstone and Salisbury: domestic policies; Irish Question",
          "Early 20th-century Britain: emergence of Labour Party; Lloyd George and social reforms—'People's Budget' and Parliament Act",
          "Unrest and protest (1901-1914): women's suffrage, Irish Home Rule crisis, trade unions"
        ]
      },
      11: {
        id: "HLO4_S11",
        title: "Italy (1815-1871) and Germany (1815-1890)",
        content: [
          "Italy (1815-1849): impact of Congress of Vienna on Italy; Austrian dominance; role of Metternich; nationalism and liberalism",
          "Attempted revolutions in Italy between 1820 and 1844; Mazzini and Gioberti; role of papacy; 1848-1849 Revolutions—causes, nature, defeat and consequences",
          "Germany (1815-1849): impact of Congress of Vienna on Germany; nationalism and liberalism in Vormärz period; economic and social change before 1848",
          "1848-1849 Revolutions—causes, nature, defeat and consequences",
          "Unification of Italy (1849-1871); Cavour and Garibaldi; role of foreign influence",
          "Rise of Prussia and decline of Austria (1815-1866); Zollverein",
          "Bismarck, Prussia and final unification: diplomatic, economic, military reorganization; Wars of Unification; 1871 Constitution",
          "Germany (1871-1890): Bismarck's domestic policies, including Kulturkampf and anti-socialist campaign; consolidation of new German state and role of Prussia within it"
        ]
      },
      12: {
        id: "HLO4_S12",
        title: "Imperial Russia, revolution and the establishment of the Soviet Union (1855-1924)",
        content: [
          "Alexander II (1855-1881): extent of reform",
          "Policies of Alexander III (1881-1894) and Nicholas II (1894-1917): economic modernization, tsarist repression and growth of opposition",
          "Causes of 1905 Revolution (including social and economic conditions and significance of Russo-Japanese War); consequences of 1905 Revolution (including Stolypin and Dumas)",
          "Impact of First World War and final crisis of autocracy in February/March 1917",
          "1917 Revolutions: February/March Revolution; Provisional Government and dual power (Soviets); October/November Revolution; Bolshevik Revolution; Lenin and Trotsky",
          "Lenin's Russia/Soviet Union; consolidation of new Soviet state; Civil War; War Communism; New Economic Policy (NEP); terror and coercion; foreign policy"
        ]
      },
      13: {
        id: "HLO4_S13",
        title: "Europe and the First World War (1871-1918)",
        content: [
          "European diplomacy and changing balance of power after 1871; imperial expansion in Africa and Asia, and its impact on European diplomacy",
          "Congress of Berlin and European Alliance system",
          "Foreign policy of Kaiser Wilhelm II: domestic conditions that impacted on German foreign policy; its impact/influence on other countries, including Britain, France, Russia and Austria-Hungary",
          "Causes of First World War: short- and long-term causes; relative importance of causes; Alliance system; decline of Ottoman Empire",
          "German foreign policy; Austria-Hungary, Russia and Balkan nationalism; arms race and diplomatic crises; July Crisis of 1914",
          "Impact of First World War on civilian populations of two countries from region between 1914 and 1918",
          "Factors leading to defeat of Germany and other Central Powers: strategic errors; economic factors; entry and role of US; domestic instability in Central Powers"
        ]
      },
      14: {
        id: "HLO4_S14",
        title: "Inter-war domestic developments in European states (1918-1939)",
        content: [
          "Weimar Germany: constitutional, political, economic/financial and social issues (1918-1933); initial challenges (1918-1923)",
          "'Golden Era' under Stresemann (1924-1929); crisis years and rise of Hitler (1929-1933)",
          "Hitler's Germany (1933-1939): consolidation of power; Hitler's pre-war domestic policies, including economic, social and political policies",
          "Nature of Nazi state; extent of resistance to Nazis",
          "Italy (1918-1939): rise of Mussolini; consolidation of power; Mussolini's pre-war domestic policies, including economic, social and political policies; nature of fascist state",
          "Spain (1918-1939): political, social and economic conditions in Spain; Primo de Rivera regime; polarization and political parties under Second Republic",
          "Azaña and Gil Robles; causes of Civil War; foreign involvement; reasons for nationalist victory under Franco",
          "Case study of domestic political, economic and social developments in one European country (other than Germany, Italy or Spain) in inter-war years"
        ]
      },
      15: {
        id: "HLO4_S15",
        title: "Diplomacy in Europe (1919-1945)",
        content: [
          "Paris peace treaties (1919-1923): Versailles; Neuilly; Trianon; St Germain; and Sèvres/Lausanne—aims, issues and responses",
          "League of Nations and Europe: successes and failures; search for collective security; developments in successor states of central and eastern Europe",
          "Italian and German foreign policies (1919-1941): aims, issues and extent of success",
          "Collective security and appeasement (1919-1941): aims, issues and extent of success; role of British, French and Russian/Soviet foreign policies (1919-1941)",
          "Chamberlain and Munich Crisis",
          "Causes of Second World War and development of European conflict (1939-1941); wartime alliance (1941-1945)",
          "Reasons for Axis defeat in 1945 and for Allied victory; role of economic, strategic and other factors",
          "Impact of Second World War on civilian populations in any two countries between 1939-1945"
        ]
      },
      16: {
        id: "HLO4_S16",
        title: "The Soviet Union and post-Soviet Russia (1924-2000)",
        content: [
          "Soviet Union (1924-1941): Stalin and struggle for power (1924-1929); defeat of Trotsky; Stalin's policies of collectivization and Five-Year Plans",
          "Government and propaganda under Stalin; purges and Great Terror",
          "Impact of Great Patriotic War (1941-1945); events in Soviet Union (1945-1953): political and economic developments",
          "Khrushchev and Brezhnev: domestic policies and foreign relations",
          "Transformation of Soviet Union (1985-1991): Gorbachev (aims, policies and extent of success); political developments and change",
          "Collapse of Soviet Union; post-Soviet Russia to 2000; role and policies of Yeltsin; political and economic developments to 2000"
        ]
      },
      17: {
        id: "HLO4_S17",
        title: "Post-war western and northern Europe (1945-2000)",
        content: [
          "Breakdown of wartime alliance; emergence of Cold War and its impact on Germany; division of Germany",
          "Post-war problems and political and economic recovery in western Europe: devastation and debt; reconstruction of France and West Germany (1945-1963) and impact of Marshall Plan",
          "Role of Adenauer; German 'economic miracle'; role of de Gaulle; 'Les Trente Glorieuses' in France",
          "West Germany (1963-1990): domestic policies; challenge of Baader Meinhof Group/Red Army Faction; reunification, role and policies of Kohl",
          "Social and cultural change in West Germany from 1949 to 1990",
          "Spain: Franco's regime and transition to, and establishment of, democracy under Juan Carlos up to 1982; political, economic and social developments in Spain (1982-2000)",
          "Case study of political, social and economic changes in one western or northern European country (other than France, Federal Republic of Germany and Spain) between 1945-2000"
        ]
      },
      18: {
        id: "HLO4_S18",
        title: "Post-war central and eastern Europe (1945-2000)",
        content: [
          "Soviet domination: motives, extent and nature of Soviet control in central and eastern Europe (1945-1955)",
          "Politics, economies (COMECON) and Warsaw Pact (1945-1955); Yugoslavia's challenge to Soviet control under Tito",
          "Support and cooperation, repression and protest (1945-1968): East Germany; Poland; Hungary; Czechoslovakia",
          "Acceptance of, and opposition to, Soviet control in central and eastern Europe (1968-1989): Bulgaria; Czechoslovakia; East Germany; Hungary; Romania; Poland",
          "Role of Walesa and Havel",
          "Collapse of Soviet control in central and eastern Europe; causes, developments and consequences",
          "Balkan conflicts in 1990s: reasons for, and consequences of, conflicts; role and policies of Milosevic",
          "Case study: economic, social and political challenges of post-communist era in any one central or eastern European country (1989-2000), including former Soviet republics in region apart from Russia"
        ]
      }
    }
  }
};


  // 4. INTERNAL ASSESSMENT
  internalAssessment: {
    title: "Historical Investigation",
    description: "Students complete a historical investigation into a topic of their choice",
    sections: {
      identification: {
        title: "Identification and evaluation of sources",
        requirements: [
          "Clear statement of question to investigate",
          "Explanation of nature and relevance of two sources",
          "Analysis of value and limitations of sources"
        ]
      },
      investigation: {
        title: "Investigation",
        requirements: [
          "Clear and effective organization",
          "Critical analysis focused on question",
          "Use of range of evidence",
          "Reasoned conclusion"
        ]
      },
      reflection: {
        title: "Reflection",
        requirements: [
          "Reflection on methods used by historians",
          "Discussion of challenges facing historians",
          "Connection to rest of investigation"
        ]
      }
    }
  },

  // Assessment structure
  assessment: {
    SL: {
      paper1: {
        weight: "30%",
        duration: "1 hour",
        description: "Source-based paper on prescribed subjects"
      },
      paper2: {
        weight: "45%",
        duration: "1.5 hours",
        description: "Essay paper on world history topics"
      },
      internalAssessment: {
        weight: "25%",
        duration: "20 hours",
        description: "Historical investigation"
      }
    },
    HL: {
      paper1: {
        weight: "20%",
        duration: "1 hour",
        description: "Source-based paper on prescribed subjects"
      },
      paper2: {
        weight: "25%",
        duration: "1.5 hours",
        description: "Essay paper on world history topics"
      },
      paper3: {
        weight: "35%",
        duration: "2.5 hours",
        description: "Essay paper on HL regional option"
      },
      internalAssessment: {
        weight: "20%",
        duration: "20 hours",
        description: "Historical investigation"
      }
    }
  }
};

// Example of how to structure lesson tagging
const lessonTaggingStructure = {
  lesson: {
    id: "lesson_001",
    title: "The Rise of Genghis Khan",
    tags: [
      {
        curriculumId: "PS1_CS1",
        specificPoints: [
          "Rise to power; uniting of rival tribes",
          "Motives and objectives; success in achieving those objectives"
        ],
        keyConcepts: ["Change", "Causation", "Significance"],
        assessmentObjectives: ["AO1", "AO2"]
      }
    ]
  }
};

// Database schema suggestion
const databaseSchema = {
  curriculumPoints: {
    id: String, // e.g., "PS1_CS1_leadership_1"
    parentId: String, // e.g., "PS1_CS1_leadership"
    type: String, // "prescribed_subject", "case_study", "topic", "subtopic"
    title: String,
    description: String,
    level: ["SL", "HL", "Both"],
    keyConcepts: [String],
    assessmentObjectives: [String]
  },
  
  lessonCurriculumTags: {
    lessonId: String,
    curriculumPointId: String,
    relevance: Number, // 1-5 scale
    teacherNotes: String,
    aiConfidence: Number, // If AI tagged
    verified: Boolean
  }
};
flowchart TD
Start([User öffnet Resource Manager]) --> View[Screen rendert]

    Action[/Tap + oder − auf einem Item/] --> State[(Inventory State<br/>single source of truth)]

    State --> Food[Food: Lembas, Äpfel, Kartoffeln]
    State --> Water[Water in ml]
    State --> Gear[Gear: Schlafsack, Schwert, Feuerholz]

    Food --> Rations{{Vollständige Rationen<br/>limitiert durch knappste Zutat}}
    Water --> Rations
    Gear --> GearReady{{Gear Readiness}}

    Rations --> Conf{{Journey Readiness<br/>60% Rationen · 40% Gear}}
    GearReady --> Conf

    State --> Values[Item-Mengen]
    Rations --> Summary[Rationen + Bottleneck-Hinweis]
    Conf --> Ring[Confidence Ring · Chart.js]

    Values --> View
    Summary --> View
    Ring --> View

    View -.informiert nächste Aktion.-> Action
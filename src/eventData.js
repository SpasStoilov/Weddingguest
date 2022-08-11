// event Data:

let dataSalads = [
    {_id: '455461', title:'Title1', recepie: 'SRecepie1', vote: '2'},
    {_id: '24444', title:'Title2', recepie: 'SRecepie2', vote: '100'},
    // {_id: 'S-0', title:'S-0', recepie: 'Recepie here...', vote: ''},
    // {_id: 'S-1', title:'S-1', recepie: 'Recepie here...', vote: ''}
]

let dataAppetizers = [
    {_id: 'fdfdfd', title:'Title1', recepie: 'ARecepie1', vote: '0'},
    {_id: 'aaasss', title:'Title2', recepie: 'ARecepie2', vote: '5'},
    // {_id: 'A-0', title:'A-0', recepie: 'Recepie here...', vote: ''},
    // {_id: 'A-1', title:'A-1', recepie: 'Recepie here...', vote: ''}
]

let dataMainMeal = [
    {_id: 'fdnhnnfdfd', title:'Title1', recepie: 'MRecepie1', vote: '100'},
    {_id: 'aaannnsss', title:'Title2', recepie: 'MRecepie2', vote: '5'},
    // {_id: 'M-0', title:'M-0', recepie: 'Recepie here...', vote: ''},
    // {_id: 'M-1', title:'M-1', recepie: 'Recepie here...', vote: ''}
]

let dataDesert = [
    {_id: 'fdnhnnfdfd', title:'Title1', recepie: 'DRecepie1', vote: '0'},
    {_id: 'aaannnsss', title:'Title2', recepie: 'DRecepie2', vote: '50'},
    // {_id: 'D-0', title:'D-0', recepie: 'Recepie here...', vote: ''},
    // {_id: 'D-1', title:'D-1', recepie: 'Recepie here...', vote: ''}
]

let dataAlcohol = [
    {_id: 'fdnhnnfdfd', title:'Title1', vote: '5'},
    {_id: 'aaannnsss', title:'Title2', vote: '0'},
    // {_id: 'L-0', title:'L-0', recepie: '', vote: ''},
    // {_id: 'L-1', title:'L-1', recepie: '', vote: ''}
]

let dataSoft = [
    {_id: 'fdnhnngnffdfd', title:'Title1', vote: '2'},
    {_id: 'aaanffffnnsss', title:'Title2', vote: '5'},
    // {_id: 'F-0', title:'F-0', recepie: '', vote: ''},
    // {_id: 'F-1', title:'F-1', recepie: '', vote: ''}
]


let event = {
    _id: 'ivnIdxxxxxxx54656555665',
    ownerId: "sdfsjkfkjsfkjsdfjksdfjksdfkjsf",
    title: "My Wedding Title",
    imageUrl: "https://www.magenboys.com/images/photo_galleries/gallery/large_1382114157.jpg",
    salads: dataSalads,
    appetizers: dataAppetizers,
    mains: dataMainMeal,
    deserts: dataDesert,
    alcohols: dataAlcohol,
    softs: dataSoft,
    locations: {addres:"Some Text Addres...."},
    guests: [],
    hints: {hints:"Some Text Hints...."}
}

export let allEvents = [event]
// Funciona como nosso banco de dados.
const produtosData = [
    {
        id: 'ovo-tradicional',
        nome: 'Ovo Tradicional',
        preco: 40.00,
        desc: 'Casca ao leite ou branco acompanhado de bombons. Fazemos versões sem açúcar. (350g)',
        img: 'https://images.unsplash.com/photo-1522814890230-0eb5379ce85f?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'ovos-colher',
        nome: 'Ovos de Colher',
        preco: 65.00,
        desc: 'Duo recheado com Brownie e Brigadeiro de Maracujá. (100g cada)',
        img: 'https://images.unsplash.com/photo-1616035118476-0f30c6fa4d52?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'ovo-caramelo',
        nome: 'Ovo Caramelo Salgado',
        preco: 95.00,
        desc: 'Meio amargo com casca recheada de caramelo e amendoim. (350g)',
        img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'ovo-concha',
        nome: 'Ovo Concha Recheado',
        preco: 75.00,
        desc: 'Casca ao leite com recheio cremoso de coco com baunilha. (150g)',
        img: 'https://images.unsplash.com/photo-1587313632739-c895db617bf6?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'ovo-panda',
        nome: 'Ovo Panda Kids',
        preco: 60.00,
        desc: 'Casca ao leite com confeito colorido e mini pandas de chocolate. (350g)',
        img: 'https://images.unsplash.com/photo-1554181467-961fba293ee6?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'ovo-urso',
        nome: 'Ovo Urso Kids',
        preco: 80.00,
        desc: 'Chocolate ao leite em formato de urso, recheado de confeito colorido. (120g)',
        img: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'ovo-fatias-metade',
        nome: 'Ovo em Fatias (Metade - 3 Fatias)',
        preco: 75.00,
        desc: 'Ao leite, meio amargo e branco, com adição de recheios separados. (250g)',
        img: 'https://images.unsplash.com/photo-1614088640306-6136a7ed2a48?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'ovo-fatias-inteiro',
        nome: 'Ovo em Fatias (Inteiro - 6 Fatias)',
        preco: 120.00,
        desc: 'Ao leite, meio amargo e branco, com adição de recheios separados. (250g)',
        img: 'https://images.unsplash.com/photo-1614088640306-6136a7ed2a48?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'bombom-4',
        nome: 'Bombom Recheado (04 un)',
        preco: 15.00,
        desc: 'Bombons variados. Escolha os sabores nas observações! (15g cada)',
        img: 'https://images.unsplash.com/photo-1548835010-ea6d634969f6?auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 'bombom-10',
        nome: 'Bombom Recheado (10 un)',
        preco: 30.00,
        desc: 'Bombons variados. Escolha os sabores nas observações! (15g cada)',
        img: 'https://images.unsplash.com/photo-1548835010-ea6d634969f6?auto=format&fit=crop&w=150&q=80'
    }
];

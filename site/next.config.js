const IMAGE_DOMAINS = process.env.IMAGE_DOMAINS || 'localhost'

// Перенос рецептов из категории "salads" в специализированные категории
// (20260818000000_split_salads_categories). Ключ — целевая категория,
// значение — список алиасов статей, уехавших из /salads/.
const SALAD_MOVES = {
  zakuski: [
    'delicious-snacks',
    'velikolepnaya-zakuska-iz-kabachkov-s-farshem',
    'zakuska-iz-yaichnyh-blinov-s-nachinkoj-prosto-i-vkusno',
    'egg-roll-with-melted-smoked-cheese',
    'eggs-stuffed-french',
    'tort-vafelnyj-s-nachinkoj-iz-farsha-morkovi-i-gribov'
  ],
  buterbrody: [
    'appetitnyie-grenki-so-shprotami-ogurczami-i-pomidorami-prosto-i-vkusno',
    'buterbrody-na-skovorode-s-nachinkoj-v-yaichnom-klyare',
    'buterbrody-s-kurinym-pashtetom-vkusno-i-sytno',
    'buterbrody-s-pashtetom-iz-kurinoj-pecheni-i-zelenyu',
    'bystryj-vkusnyj-zavtrak-buterbrody-s-nachinkoj-v-yaichnom-klyare',
    'vkusnyie-i-appetitnyie-goryachie-buterbrodyi-s-syirom-i-pomidorami',
    'goryachie-buterbrody-v-duhovke-vkusno-i-bystro',
    'vtrak-ne-tolko-bystro-no-i-vkusno',
    'goryachie-buterbrody-na-zavtrak-prosto-i-vkusno',
    'goryachie-buterbrody-s-kurinym-myasom-i-syrom-sytnye-i-appetitnye',
    'prostoj-recept-goryachih-buterbrodov-iz-krabovymi-palochkami-i-syrom'
  ],
  lavash: [
    'vkusnaya-zakuska-iz-lavasha-kurinogo-file-i-syra-na-skovorode',
    'lavash-s-myasnoj-nachinkoj-v-klyare-na-skovorode',
    'lavash-s-myasnoj-nachinkoj-na-skovorode-vkusnyj-i-appetitnyj',
    'lavash-s-nachinkoj-iz-myasa-yaic-i-morkovi',
    'lavash-s-nachinkoj-iz-syra-ovoshej-i-myasa-prosto-i-vkusno',
    'prostoj-i-bystryj-recept-lavasha-s-plavlenym-syrom-i-yajcami-vkusno-i-sytno'
  ],
  zavtraki: [
    'vkusnyj-zavtrak-v-duhovke-ili-na-skovorode-iz-yaic-tvoroga-i-syra',
    'vkusnyj-zavtrak-iz-yaic-tvoroga-pomidorov-i-kolbasy-ili-vetchiny',
    'vkusnyj-i-appetitnyj-zavtrak-iz-vetchinyi-i-syra-v-klyare',
    'vkusnyj-i-appetitnyj-zavtrak-iz-omleta-chesnochnyh-strelok-i-syra',
    'vkusnyj-i-sytnyj-zavtrak-ili-uzhin',
    'nezhnyj-yaichnyj-omlet-s-syrom-na-skovorode',
    'omlet-iz-yaic-na-vodyanoj-bane',
    'omlet-s-shampinonami-i-zharenym-lukom-vkusnyj-i-sytnyj-zavtrak'
  ],
  pashtery: [
    'bliny-iz-pecheni-s-gribnoj-nachinkoj-vkusnye-i-sytnye',
    'pashtet-iz-kurinoj-pecheni-vkusno-i-prosto',
    'liver-pate',
    'pashtet-iz-svinoj-pecheni-vkusno-i-sytno',
    'prostoj-recept-torta-iz-pecheni-syra-luka-i-morkovi'
  ],
  'sousy-i-zagotovki': [
    'domashnij-majonez-na-varenyh-zheltkah',
    'homemade-ketchup',
    'zapravki-iz-hrena-s-uksusom-svekloj-i-s-majonezom'
  ],
  'domashnie-syry': [
    'adygejskij-domashnij-syr-na-syvorotke-prosto-i-vkusno',
    'homemade-dutch-cheese',
    'domashnij-syr-k-chayu-prosto-i-bystro',
    'recept-domashnego-syra-prosto-i-vkusno'
  ],
  'ovoshhnye-bljuda': [
    'baklazhany-v-yaichnom-klyare-i-panirovochnyh-suharyah-s-ovoshami',
    'baklazhany-po-kubanski-vkusnye-i-appetitnye',
    'baklazhany-s-lukom-i-morkovyu-tushenye-na-skovorode',
    'baklazhany-s-lukom-tushennye-v-smetane',
    'baklazhany-s-pomidorami-i-syrom-zapechennye-v-duhovke',
    'baklazhany-tushenye-v-smetane-prosto-i-vkusno',
    'kabachki-v-klyare-s-tverdym-syrom',
    'kabachki-v-klyare-syitno-i-vkusno',
    'kabachki-zharenye-s-chesnokom-majonezom-i-ukropom',
    'kabachki-farshirovannye-myasnym-farshem-lukom-morkovyu-i-syrom',
    'squash-caviar',
    'kabachkovye-lepeshki-s-syrom-i-mannoj-krupoj-zapechennye-v-duhovke',
    'kabachkovyie-oladi-s-farshem-nezhnyie-i-syitnyie',
    'zapekanka-iz-kabachkov-file-syra-i-pomidorov',
    'kapusta-brokkoli-zharenaya-v-klyare-iz-yaic-prosto-i-vkusno',
    'kapusta-tushenaya-s-baklazhanami-i-ovoshhami',
    'kapustnyie-oladi-vkusno-i-prosto',
    'ovoshnye-kotlety-s-ovsyanoj-krupoj-vkusnye-i-sytnye',
    'prostoj-recept-ovoshnyh-oladij-iz-patisson-prosto-i-vkusno',
    'cvetnaya-kapusta-v-klyare-prosto-i-vkusno',
    'zharenye-ostrye-chesnochnye-strelki-s-morkovyu-i-lukom',
    'chesnochnye-strelki-tushenye-s-ovoshami-prosto-i-vkusno'
  ],
  conservation: [
    'kapusta-marinovannaya-s-percem-morkovьyu-i-chesnokom',
    'chesnok-sushim-v-duhovke-v-domashnih-usloviyah'
  ],
  'zametki-o-salatakh': [
    'the-history-of-the-salad'
  ]
}

const SALAD_REDIRECTS = Object.entries(SALAD_MOVES).flatMap(([category, aliases]) =>
  aliases.map((alias) => ({
    source: `/salads/${alias}`,
    destination: `/${category}/${alias}`,
    permanent: true
  }))
)

// Перенос рецептов из категории "entrees" в специализированные категории супов
// (20260818010000_split_entrees_categories). Ключ — целевая категория.
const SOUP_MOVES = {
  'borshchi-i-rassolniki': [
    'green-soup',
    'krasnyj-borsh-s-gribami-vkusnyj-i-sytnyj',
    'red-borsch',
    'prostoj-recept-krasnogo-borsha-prosto-i-vkusno',
    'prostoj-recept-rassolnika-s-risom-i-solenymi-ogurcami',
    'pickle'
  ],
  'gribnye-i-ovoshhnye-supy': [
    'prostoj-recept-kartofelnogo-gribnogo-supa',
    'mushroom-soup',
    'vegetable-soup-with-meatballs',
    'sup-fasolevyj-s-gribami-vkusno-i-appetitno'
  ],
  'supy-iz-bobovyh': [
    'appetitnyij-fasolevyij-sup',
    'sup-iz-checheviczyi',
    'pea-soup-with-smoked',
    'fasolevyj-sup-s-myasnymi-frikadelkami-i-svezhimi-pomidorami'
  ],
  'supy-s-myasom-i-pticej': [
    'soup-with-meatballs',
    'sup-kartofelnyj-s-domashnimi-pelmenyami-iz-myasom-svininy',
    'sup-kurinyj-s-syrnymi-sharikami-prosto-i-appetitno',
    'kurinyj-sup-s-zelyonym-goroshkom',
    'soup-with-sausage-finnish-recipe',
    'zamechatelnyij-sup-s-kleczkami',
    'soup-with-garlic-dumplings'
  ],
  'krupyanye-supy': [
    'soup-with-pasta',
    'sup-vermishelevyj-s-shampinonami-prosto-i-vkusno',
    'sup-risovyj-s-shampinenami-i-protertymi-pomidorami',
    'risovyj-sup-s-frikadelkami-i-pomidorami-pitatelnoe-i-sytnoe-blyudo',
    'pshennyj-ostryj-sup-so-svininoj-i-zelenyu',
    'recept-grechnevogo-supa-s-kurinymi-myasom',
    'prostoj-recept-supa-s-frikadelkami-i-grechnevoj-lapshoj'
  ]
}

const SOUP_REDIRECTS = Object.entries(SOUP_MOVES).flatMap(([category, aliases]) =>
  aliases.map((alias) => ({
    source: `/entrees/${alias}`,
    destination: `/${category}/${alias}`,
    permanent: true
  }))
)

// Перенос рецептов из категории "main-dishes" в специализированные категории
// (20260818040000_split_main_dishes_categories). Ключ — целевая категория.
const MAIN_DISH_MOVES = {
  // Категории vareniki-i-pelmeni и zapekanki-i-makarony объединены в
  // domashnyaya-klassika (20260818080000_merge_pasta_dumplings_into_classics).
  'domashnyaya-klassika': [
    'vareniki-na-kefire-s-zhimolostyu-na-paru',
    'dumplings-with-halva',
    'vareniki-s-klubnikoj-prigotovlennye-na-paru',
    'dumplings-with-cottage-cheese',
    'dumplings-with-cherries',
    'vozdushnye-vareniki-s-zharenoj-kvashenoj-kapustoj-prigotovlennye-na-paru',
    'dumplings-with-cabbage',
    'parovyie-vareniki-s-vishnej',
    'prostoj-recept-varenikov-s-tvorogom-vkusnye-i-appetitnye',
    'lazy-dumplings',
    'dumplings-with-mushroom-and-potato-stuffing',
    'vareniki-s-kurinym-myasom-i-zharenym-lukom',
    'domashnie-pelmeni-vkusno-i-appetitno',
    'fried-dumplings-with-egg-dough',
    'dumplings',
    'prostoj-recept-pelmenej-so-svininoj-iz-zavarnogo-testa',
    'lenivye-belyashi-prosto-i-vkusno',
    'vkusnaya-zapekanka-iz-makaron-i-tvoroga',
    'zapekanka-iz-makaron-s-tvorogom-izyumom-i-vishnej-prosto-i-vkusno',
    'prostoj-recept-makaronnyh-izdelij-s-tvorogom-i-izyumom',
    'zapekanka-iz-makaronnyh-izdelij-s-yajcami-i-molokom',
    'macaroni-and-cheese'
  ],
  'mjasnye-bljuda': [
    'appetitnye-syrnye-blinchiki-s-myasnoj-nachinkoj',
    'buryj-ris-s-myasom-v-multivarke',
    'grechnevaya-kasha-s-ovoshami-i-file-prostoe-i-vkusnoe-blyudo',
    'kinoa-s-myasom-i-ovoshami-polezno-i-sytno',
    'pilaf',
    'pshenichnaya-kasha-s-myasom-prosto-i-vkusno',
    'rice-patties',
    'chechevicza-tushyonaya-s-ovoshhami-i-file',
    'makaronnaya-zapekanka-s-kuricej-syrom-i-pomidorami',
    'makaronnye-gnyozda-s-myasom-i-syrom-v-souse',
    'makaronnye-gnyozda-s-farshem-i-syrom-na-skovorode',
    'makaronyi-s-farshem-i-lukom',
    'prostoj-recept-makaronnyh-izdelij-s-myasom-syrom-i-lukom-vkusno-i-appetitno',
    'spagetti-iz-grechnevoj-muki-s-myasom-i-ovoshami',
    'zapekanka-ziti-iz-myasnymi-sharikami-syrom-i-protertymi-pomidorami'
  ],
  'ovoshhnye-bljuda': [
    'kabachki-farshirovannyie-risom-s-farshem',
    'stuffed-peppers',
    'chesnochnye-strelki-s-myasom-i-ovoshami-tushenye-v-soevom-souse-vkusnye-i-appetitnye',
    'chechevica-tushenaya-s-ovoshami-polezno-i-vkusno'
  ],
  zavtraki: [
    'delicious-breakfast',
    'omelette',
    'scrambled-eggs-with-asparagus'
  ],
  buterbrody: [
    'hot-appetizer'
  ],
  'sousy-i-zagotovki': [
    'sous-smetannyj-s-syrom-i-kolbasoj-k-makaronam'
  ]
}

const MAIN_DISH_REDIRECTS = Object.entries(MAIN_DISH_MOVES).flatMap(([category, aliases]) =>
  aliases.map((alias) => ({
    source: `/main-dishes/${alias}`,
    destination: `/${category}/${alias}`,
    permanent: true
  }))
)

// Перенос рецептов из категории "baking" в специализированные категории
// (20260818050000_split_baking_categories). Ключ — целевая категория.
const BAKING_MOVES = {
  'bulki-hleb': [
    'batony-domashnie-dlya-buterbrodov-vozdushnye-i-myagkie',
    'batony-iz-drozhzhevogo-sdobnogo-testa-s-izyumom-i-kunzhutom',
    'bulochka-kosichka',
    'buns-with-chocolate-glaze-with-coconut',
    'bulochki-vozdushnyie-sloistyie-s-kroshkoj',
    'bulochki-vozdushnye-myagkie-sloistye-i-vkusnye',
    'bulochki-iz-drozhzhevogo-testa-s-zavarnym-kremom-i-vinogradom',
    'bulochki-iz-drozhzhevogo-testa-s-nachinkoj-iz-izyuma-i-koricy',
    'bulochki-iz-sdobnogo-drozhzhevogo-testa-s-makovoj-nachinkoj',
    'bulochki-iz-sloenogo-drozhzhevogo-testa-s-koricej-i-izyumom',
    'bulochki-iz-sloenogo-drozhzhevogo-testa-s-nachinkoj-iz-shokolada-ili-dzhema',
    'bulochki-iz-sloenogo-testa-s-koricej-i-izyumom',
    'bulochki-iz-zavarnym-kremom-iz-drozhzhevogo-testa-s-dobavleniem-kartofelya',
    'bulochki-s-izyumom-v-muchnoj-kroshke-vozdushnye-i-vkusnye',
    'buns-with-raisins',
    'bulochki-s-izyumom-iz-sdobnogo-drozhzhevogo-testa-vozdushnye-i-nezhnye',
    'bulochki-s-izyumom-vozdushnye-i-myagkie',
    'cinnamon-rolls',
    'bulochki-s-nachinkoj-iz-zharenyh-yablok-izyuma-i-koricy',
    'bulochki-s-nachinkoj-iz-shokoladnoj-kroshki-vozdushnye-i-aromatnye',
    'bulochki-s-nachinkoj-iz-yablok-i-maka',
    'bulochki-s-saxarnoj-nachinkoj-prosto-i-vkusno',
    'buns-with-sugar-to-tea',
    'bulochki-s-shokoladnoj-kroshkoj-iz-drozhzhevogo-testa-na-zheltkax',
    'brioche-pastry-with-raisins',
    'zamechatelnyie-bulochki-bez-yaicz-v-saxare',
    'vozdushnye-bulochki-iz-drozhzhevogo-testa-s-varenem-i-koricej',
    'vozdushnye-domashnie-bulochki-v-shokoladnoj-glazuri',
    'bulochki-s-zavarnyim-kremom',
    'vozdushnye-i-myagkie-bulochki-s-izyumom-v-saharnoj-glazuri',
    'vozdushnye-i-myagkie-bulochki-na-smetane-s-izyumom-i-koricej',
    'vozdushnye-i-nezhnye-bulochki-s-zavarnym-kremom-i-izyumom',
    'grebeshki-s-zavarnyim-kremom',
    'vozdushnyie-i-sloistyie-bulochki-ulitki-s-nachinkoj-iz-nezhnogo-zavarnogo-krema',
    'myagkie-i-vozdushnyie-bulochki-ulitka-s-nachinkoj',
    'vozdushnye-sdobnye-kolechki-iz-drozhzhevogo-testa',
    'vozdushnye-treugolniki-prosto-i-vkusno',
    'domashnie-bulochki-s-nachinkoj-iz-shokoladnoj-kroshki',
    'domashnie-batony-s-kunzhutom-na-syvorotke-prosto-i-vkusno',
    'domashnij-baton-s-kunzhutom-dlya-buterbrodov',
    'prostoj-reczept-bulochek-dlya-buterbrodov-i-gamburgerov',
    'delicious-scones-for-tea',
    'prostoj-recept-vozdushnyh-bulochek-«zebra»',
    'prostoj-reczept-bulochek',
    'prostoj-reczept-domashnego-vozdushnogo-belogo-xleba',
    'prostoj-recept-domashnih-batonov-na-syvorotke',
    'vozdushnye-sloistye-bulochki-s-kunzhutom-iz-prostyh-i-dostupnyh-ingredientov',
    'saharnye-bulochki-k-chayu-prosto-i-vkusno',
    'shokoladnye-bulochki-iz-zavarnym-kremom-nezhnye-i-vozdushnye',
  ],
  'pirozhki': [
    'appetitnyie-pirozhki-s-myasnoj-nachinkoj',
    'appetitnyie-pirozhki-so-sgushhennyim-varenyim-molokom',
    'vkusnyie-zharenyie-pirozhki-iz-drozhzhevogo-testa-so-slivami',
    'vkusnye-i-sytnye-pirozhki-iz-drozhzhevogo-testa-s-myasnoj-nachinkoj',
    'vkusnyie-pirozhki-s-nachinkoj-iz-tushenyix-yablok',
    'vkusnyie-sochnyie-zharenyie-pirozhki-na-kefire-s-yablokami',
    'pirozhki-s-zavarnyim-kremom',
    'pirozhki-s-chernoslivom-vozdushnyie-i-myagkie',
    'pies-with-apple-filling',
    'pirozhki-s-tvorogom',
    'zharenye-pirozhki-iz-drozhzhevogo-testa-s-myasom',
    'zharenye-pirozhki-iz-tvorozhnogo-testa-s-farshem-i-lukom-vkusnye-i-appetitnye',
    'myagkie-i-rassypchatye-pirozhki-na-kefire-s-yablochnoj-nachinkoj',
    'pirozhki-iz-drozhzhevogo-testa-na-smetane-s-myasnoj-nachinkoj-zharenye-na-skovorode',
    'pirozhki-iz-drozhzhevogo-testa-s-makovoj-nachinkoj',
    'pirozhki-so-sgushhyonnyim-molokom',
    'pirozhki-iz-drozhzhevogo-testa-so-slivovoj-nachinkoj-vozdushnye-i-sochnye',
    'pirozhki-iz-sdobnogo-drozhzhevogo-testa-s-vishnej-i-klubnikoj-sochnye-i-appetitnye',
    'pirozhki-iz-sdobnogo-drozhzhevogo-testa-s-nachinkoj-i-svezhih-obzharennyh-yablok',
    'pirozhki-iz-sloenogo-bez-drozhzhevogo-testa-s-yagodami',
    'pirozhki-iz-sloyonogo-testa-s-myasnoj-nachinkoj',
    'pirozhki-s-kapustoj',
    'pirozhki-s-klubnikoj-iz-bezdrozhzhevogo-testa-vozdushnye-i-rassypchatye',
    'pirozhki-s-myasnoj-nachinkoj-i-kunzhutom-prosto-i-vkusno',
    'meat-pies-puff-pastry',
    'pirozhki-s-fasolevoj-nachinkoj-v-chesnochnoj-zalivke-prosto-i-vkusno',
    'pirozhki-s-yajczom-i-zelenyim-lukom',
    'pirozhki-so-slivoj-iz-drozhzhevogo-testa-vodolaz',
    'pirozhki-so-slivoj-zharenye-na-skovorode',
    'prostoj-recept-zharenyh-pirozhkov-s-nachinkoj-iz-kurinogo-file-i-luka',
    'prostoj-recept-pirozhkov-na-rastitelnom-masle-s-myasnoj-nachinkoj',
    'pies-with-beans-with-garlic-sauce',
    'prostoj-reczept-pirozhkov-s-yaichnoj-nachinkoj-iz-drozhzhevogo-testa',
    'prostoj-recept-sochnyh-i-vozdushnyh-pirozhkov-s-yablokami',
    'samyj-prostoj-recept-pirozhkov-s-kapustoj-iz-drozhzhevogo-testa',
    'sochnyie-pirozhki-s-vishnej',
  ],
  'bliny-i-oladi': [
    'blinchiki-appetitnyie-s-nachinkoj',
    'pancakes-with-poppy-seeds',
    'spring-rolls',
    'blinchiki-s-nachinkoj-iz-varenogo-sgushennogo-moloka',
    'blinchiki-s-nachinkoj-iz-kurinogo-myasa-i-syra-vkusnye-i-sytnye',
    'crepes-with-apple-filling',
    'pancakes-with-cottage-cheese',
    'blinchiki-s-halvoj-i-drugoj-nachinkoj',
    'pancakes-sour',
    'bliny-iz-drozhzhevogo-testa-s-dobavleniem-bananov-myagkie-i-nezhnye',
    'pancakes-lace',
    'blinyi-na-majoneze',
    'bliny-s-dzhemom-ili-slivochnym-maslom-vkusno-i-prosto',
    'bliny-s-tvorozhnoj-nachinkoj-vkusnye-i-appetitnye',
    'bliny-s-yaichnoj-nachinkoj-vkusnye-i-sytnye',
    'bliny-so-slivochnym-maslom-saharom-i-yagodami',
    'egg-pancakes-with-butter',
    'samyij-prostoj-reczept-oladev-na-kefire-s-vishnej',
    'vozdushnyie-iappetitnyie-oldi-n-kefire',
    'pancakes-made-of-yeast-dough',
    'vozdushnyie-oladi-na-kefire-s-chernoj-smorodinoj',
    'nezhnye-blinchiki-zebra-s-nachinkoj-iz-varenogo-sgushennogo-moloka',
    'nezhnyie-blinchiki-s-varenyim-sgushhennyim-molokom',
    'pancakes-with-egg-filling',
    'nezhnye-bliny-so-slivochnym-maslom-i-yagodami',
    'biskvitnyie-blinchiki',
    'nezhnye-i-myagkie-bliny-s-myodom',
    'nezhnye-oladi-na-moloke',
    'pancakes-on-kefir-or-soured-milk',
    'pancakes-on-the-yogurt-with-apples-or-peaches',
    'oladi-pyshnye-vkusnye-i-appetitnye',
    'pancakes-with-bananas',
    'oladi-s-na-kefire-s-yagodami-zhimolosti-vozdushnye-i-nezhnye',
    'oladi-s-tvorogom-i-yablokami-prosto-i-vkusno',
    'pankejki-s-yagodami-vkusno-i-prosto',
    'prostoj-recept-oladij-na-kefire-s-yagodami-klubniki',
    'pyshnye-i-vozdushnye-oladi-na-kefire-so-slivoj',
    'recept-oladij-iz-muki-i-manki-bez-yaic',
    'tvorozhnye-bliny-s-zhele-nezhnye-i-vkusnye',
  ],
  'perekusy': [
    'bubliki-iz-drozhzhevogo-testa-s-myasnoj-nachinkoj-vkusnye-i-sytnye',
    'homemade-pasties',
    'domashnyaya-picca',
    'domashnyaya-picca-s-kolbasoj-pomidorami-i-sladkim-percem',
    'domashnyaya-picca-s-shampinonami-kolbasoj-pomidorami-i-syrom',
    'lavash-s-myasnoj-syrnoj-i-ovoshnoj-nachinkoj-prigotovlennyj-v-duhovke-otlichaetsya-prostotoj-i-vysokimi-vkusovymi-kachestvami',
    'lavash-s-nachinkoj-iz-kurinogo-myasa-syra-i-pomidorov',
    'lavash-s-nachinkoj-iz-file-shampinonov-v-klyare-na-skovorode',
    'lavash-s-tvorozhnoj-nachinkoj-i-yagodami-na-skovorode',
    'lenivaya-picca-iz-armyanskogo-hleba-matnakash-bystro-i-vkusno',
    'lepeshki-s-myasnoj-nachinkoj-v-duhovke',
    'pampushki-s-chesnokom-k-borshu',
    'pizza-home',
    'pizza-fast-cooking',
    'picca-domashnyaya-prosto-bystro-i-vkusno',
    'picca-na-skovorode-prosto-bystro-i-vkusno',
    'simple-pizza-recipe',
    'sausage-rolls',
    'sosiski-v-teste-i-pampushki-v-chesnochnoj-zalivke-vkusno-i-prosto',
    'sosiski-zapechennye-v-teste-na-kefire',
    'treugolniki-iz-lavasha-v-klyare-iz-yaic-i-syra-na-skovorode',
    'dumplings-with-garlic',
    'zalivnoj-myasnoj-pirog-na-kefire-s-syrom-vkusnyj-i-appetitnyj',
    'zalivnoj-pirog-na-kefire-s-farshem-i-syrom-na-skovorode',
    'zalivnoj-pirog-s-myasom-i-lukom-vkusnyj-i-sytnyj',
    'prostoj-recept-drozhzhevogo-testa-dlya-pirozhkov-s-nachinkoj-i-sosisok-v-teste',
  ],
  'keksy-i-ruliety': [
    'vozdushnye-i-myagkie-keksy-s-yablokami',
    'vozdushnye-keksy-iz-biskvitnogo-testa-s-nachinkoj-iz-varenoj-sgushenki-i-kokosovoj-struzhkoj',
    'vozdushnyj-i-nezhnyj-keks-s-dobavleniem-tvoroga-i-izyuma',
    'domashnie-keksy-na-kefire-s-izyumom-i-zavarnym-kremom',
    'domashnie-keksy-na-moloke-s-yagodami-maliny',
    'domashnij-keks-s-izyumom-i-s-dobavleniem-tvoroga-nezhnyj-i-vkusnyj',
    'keksy-«zebra»-iz-biskvitnogo-testa-vkusnye-i-aromatnye',
    'keksy-iz-biskvitnogo-testa-s-koricej-i-malinoj-vozdushnye-i-nezhnye',
    'cupcakes-zebra-from-biscuit-dough',
    'keksy-iz-mannoj-krupy-na-jogurte-vozdushnye-i-aromatnye',
    'keksy-na-smetane-s-vishnevym-dzhemom-i-shokoladnoj-kroshkoj',
    'myagkie-i-vozdushnye-tvorozhnye-keksiki-s-izyumom',
    'myagkie-i-rassypchatye-keksy-s-izyumom-i-tvorogom',
    'nezhnyie-i-vozdushnyie-keksyi-iz-biskvitnogo-kofejnogo-testa',
    'shokoladnye-keksy-k-chayu-prosto-vkusno',
    'vozdushnaya-pashalnaya-vypechka-kraffiny',
    'sponge-roll',
    'biskvitnyij-rulet-malinovyim-varenem',
    'biskvitnyj-rulet-s-nachinkoj-iz-persikov-vkusno-i-appetitno',
    'biskvitnyij-shokoladnyij-rulet-s-nezhnyim-slivochno-zavarnyim-kremom',
    'ruletiki-iz-drozhzhevogo-testa-so-sgushhennyim-molokom',
    'prostoj-recept-ruleta-s-dzhemom-iz-drozhzhevogo-testa',
    'roll-out-biscuit-dough-with-jam',
    'rulet-iz-biskvitnogo-testa-s-nachinkoj-iz-svezhih-sliv',
    'rulet-s-biskvitnogo-testa-s-shokoladom-i-dzhemom-vkusnyj-i-appetitnyj',
    'rulet-iz-biskvitnogo-shokoladnogo-testa-s-nachinkoj-iz-klubnichnogo-varenya',
    'rulet-iz-sdobnogo-drozhzhevogo-testa-s-nachinkoj-iz-suhofruktov',
    'rulet-s-belkovyim-kremom',
    'jelly-roll-quick-and-tasty',
    'filled-roll-with-chocolate',
    'rulet-s-yablochnyim-dzhemom-v-shokoladnoj-glazuri-prosto-i-vkusno',
    'ruletiki-s-dzhemom',
    'cake-with-boiled-condensed-milk',
    'shokoladnyj-rulet-s-nachinkoj-iz-varenogo-sgushennogo-moloka-s-apelsinom',
    'shokoladnyj-rulet-s-nezhnoj-tvorozhnoj-nachinkoj',
  ],
  'pryaniki': [
    'pryaniki-limonnyie',
    'domashnie-pryaniki-v-glazuri-myagkie-i-vkusnye',
    'pryaniki-v-glazuri',
    'gingerbread-yogurt',
    'gingerbread',
    'medovoe-pechene-k-prazdniku',
    'medovye-pryaniki-myagkie-i-rassypchatye',
    'prostoj-recept-pryanikov-na-kefire-s-izyumom-prosto-i-vkusno',
    'prostoj-recept-shokoladnyh-pryanikov',
    'pryaniki-v-belkovoj-glazuri-vkusnyie-i-myagkie',
    'pryaniki-v-molochnoj-glazuri-vkusno-i-appetitno',
    'pryaniki-domashnie',
    'pryaniki-iz-nezhnogo-zavarnogo-testa-i-pokrytye-molochnoj-glazur',
    'peppermint-gingerbread',
    'pryaniki-rassyipchatyie-i-myagkie-v-glazuri-s-yablochnoj-nachinkoj',
  ],
  'kulichi': [
    'vozdushnye-prazdnichnye-domashnie-kulichi',
    'domashnie-vozdushnye-prazdnichnye-kulichi',
    'domashnie-kulichi-v-saharnoj-glazuri-na-zhelatine-vozdushnye-i-myagkie',
    'domashnie-pashalnye-kulichi-vozdushnye-myagkie-i-vkusnye',
    'kulich-pashalnyj-prazdnichnyj',
    'cake-recipe-my-mom',
    'kulich-po-semejnomu-reczeptu',
    'cake-festive',
    'poshepny-cake',
  ],
  'tvorozhnaya-vypechka': [
    'bulochki-iz-tvorozhnogo-testa-s-tvorozhnoj-nachinkoj',
    'vozdushnye-i-nezhnye-tvorozhnye-zavitushki-iz-drozhzhevogo-testa-bez-yaic-v-smetannoj-zalivke',
    'nezhnyie-tvorozhnyie-syirniki-s-yagodami',
    'cheesecakes',
    'prostoj-recept-tvorozhnyh-bulochek-na-rastitelnom-masle-myagkie-i-appetitnye',
    'prostoj-reczept-tvorozhnyix-zavitushek-v-smetannoj-zalivke',
    'recept-nezhnoj-tvorozhnoj-zapekanki-s-izyumom',
    'syrniki-zapechennye-v-duhovke-nezhnye-sochnye-i-vkusnye',
    'syrniki-iz-tvoroga-risovoj-muki-i-kokosovoj-struzhki',
    'tvorozhnaya-vypechka-na-skovorode-k-chayu-bystro-i-vkusno',
    'cottage-cheese-casserole',
    'tvorozhnaya-zapekanka-na-mannoj-krupe-i-krahmale',
    'tvorozhnaya-zapekanka-s-izyumom-nezhnaya-i-vkusnaya',
    'tvorozhnye-bulochki-vozdushnye-i-nezhnye',
  ],
  'sladosti': [
    'biskvitnye-pirozhnye-s-yagodami-maliny-i-belkovym-kremom',
    'vafli-myagkie-vozdushnye-s-shokoladom-i-kunzhutom',
    'vafli-myagkie-shokoladnye-s-yagodami-i-proslojkoj-iz-varenogo-sgushennogo-moloka',
    'vafli-s-dobavleniem-chernichnogo-jogurta-myagkie-i-vozdushnye',
    'vafli-shokoladnye-myagkie-aromatnye-i-vkusnye',
    'vkusnyj-i-bystryj-desert-k-chayu',
    'vozdushnye-ponchiki-v-molochnoj-glazuri-ispechennye-v-duhovke',
    'korzhiki-k-chayu',
    'domashnie-molochnye-saharnye-suhariki',
    'zharenye-ponchiki-bez-yaic-s-nachinkoj-i-s-kunzhutom',
    'zavarnye-pirozhnye-s-maslyanym-kremom-vkusnye-i-appetitnye',
    'sclera',
    'kruassany-s-nachinkoj-iz-zavarnogo-krema-i-dzhema',
    'mannyj-puding-s-yagodami-klubniki',
    'mannyij-pirog-s-yagodami',
    'myagkie-vafli-s-vishnej-i-nachinkoj-prosto-i-vkusno',
    'myagkie-vafli-s-yagodami-prosto-i-vkusno',
    'myagkie-vafli-so-smorodinovym-varenem-v-shokoladnoj-glazuri',
    'myagkie-venskie-vafli-s-nachinkoj-iz-varenogo-sgushyonnogo-moloka-v-duhovke',
    'donuts-rings',
    'ponchiki-tvorozhnyie-penyochki',
    'prostoj-recept-domashnih-korzhikov-myagkih-i-rassypchatyh',
    'prostoj-recept-korzhikov-na-jogurte-bystro-i-prosto',
    'korzhiki-s-dalekogo-detstva',
    'profitroli-s-nezhnym-zavarnym-kremom',
    'rogaliki-iz-sdobnogo-drozhzhevogo-testa-s-chernoslivom',
    'rogaliki-iz-sdobnogo-drozhzhevogo-testa-s-nachinkoj-iz-varenogo-sgushennogo-moloka',
    'rogaliki-iz-sdobnogo-drozhzhevogo-testa-s-nachinkoj-iz-maka-i-yagod',
    'rogaliki-iz-testa-s-dobavleniem-tvoroga-i-nachinkoj-iz-yagod-maliny',
    'sicilijskie-trubochki-kannoli-s-kremom-nezhnye-i-hrustyashie',
    'slojki-s-saharnoj-pudroj-vozdushnye-i-hrustyashie',
    'trubochki-kannoli-s-nachinkoj-iz-zavarnogo-krema-s-yagodami-klubniki',
    'hrustyashie-trubochki-s-nachinkoj-iz-tvoroga-i-varenogo-sgushennogo-moloka',
    'cake-choco-pie',
    'shokoladnye-pirozhnye-s-malinoj-i-belkovym-kremom',
    'desert-k-chayu-iz-batona-dzhema-slivochnogo-masla-i-kunzhuta',
    'desert-k-chayu-iz-batona-sliv-i-maliny',
    'vozdushnye-i-rassypchatye-rogaliki-s-dzhemom',
    'vkusnyie-i-appetitnyie-sochni-s-tvorogom',
  ],
  'buterbrody': [
    'buterbrody-s-nachinkoj-iz-yaic-syra-pomidorov-i-zelenogo-luka-na-skovorode',
    'buterbrody-s-syrom-i-farshem-v-klyare-na-skovorode',
    'buterbrody-s-tvorozhnoj-nachinkoj-i-yagodami-v-duhovke',
    'buterbrody-s-yajcami-i-syrom-zharenye-na-skovorode',
    'prostoj-recept-goryachih-buterbrodov-s-zharenym-lukom',
  ],
}

const BAKING_REDIRECTS = Object.entries(BAKING_MOVES).flatMap(([category, aliases]) =>
  aliases.map((alias) => ({
    source: `/baking/${alias}`,
    destination: `/${category}/${alias}`,
    permanent: true
  }))
)

// Перенос рецептов из категории "conservation" в специализированные категории
// (20260818060000_split_conservation_categories). Ключ — целевая категория.
const CONSERVATION_MOVES = {
  'soleniya-i-marinady': [
    'appetitnaya-kapusta-byistrogo-marinovaniya',
    'cabbage-day-marinating',
    'cabbage-plushka',
    'cabbage-quick-pickling-vegetables',
    'cucumber-slices-in-a-spicy-oil-marinade',
    'kapusta-marinovannaya-s-percem-morkovьyu-i-chesnokom',
    'pepper-in-the-marinade',
    'pickles-with-ketchup',
    'preserved-cucumbers-with-citric-acid',
    'recept-domashnih-hrustyashie-konservirovannyh-ogurcov',
    'crunchy-canned-pickles',
    'eggplant-in-bulgarian',
  ],
  'salaty-na-zimu': [
    'bean-salad-and-greens',
    'lazy-spark',
    'ostryj-salat-iz-patisson-po-korejski',
    'salad-dozen',
    'salad-for-the-winter-with-cabbage',
    'salad-of-red-beet',
    'salad-of-zucchini',
    'salad-with-cabbage-for-the-winter',
    'salad-with-eggplant-for-the-winter',
    'salat-iz-zelenyix-pomidor-na-zimu',
    'zagotovki-na-zimu-salat-iz-patisson-i-ovoshej',
    'pickled-vegetables-assorti',
  ],
  'ovoshhnaya-ikra': [
    'eggs-from-the-little-blue',
    'ikra-iz-baklazhan-i-ovoshej-vkusnaya-i-appetitnaya',
    'squash-caviar-for-the-winter',
    'appetizer-of-eggplant-and-onion',
  ],
  'sousy-i-pripravy': [
    'chicken-with-apples',
    'prostoj-recept-domashnego-ketchupa',
  ],
  'konservirovannye-ovoshhi': [
    'canned-peas',
    'canned-sorrel',
    'canned-tomatoes-with-onions-and-red-beets',
    'fresh-tomatoes',
    'peppers-for-winter',
    'zucchini-ukrainian',
  ],
  'sushka': [
    'chesnok-sushim-v-duhovke-v-domashnih-usloviyah',
  ],
  'zametki-o-konservacii': [
    'on-preserving-and-pickling',
  ],
}

const CONSERVATION_REDIRECTS = Object.entries(CONSERVATION_MOVES).flatMap(([category, aliases]) =>
  aliases.map((alias) => ({
    source: `/conservation/${alias}`,
    destination: `/${category}/${alias}`,
    permanent: true
  }))
)

// Перенос рецептов из категории "drinks" в специализированные категории
// (20260818070000_split_drinks_categories). Ключ — целевая категория.
const DRINKS_MOVES = {
  'napitki': [
    'compote-from-fresh-apples-and-cherries',
    'compote-from-klubnik',
    'compote-from-plums',
    'compote-of-dried-fruits',
    'compote-of-fresh-apples-or-pears',
    'stewed-prunes-and-dried-apricots',
    'mors-iz-revenya-i-chernoj-smorodiny',
    'morse-cranberry',
    'prohladitelnyj-napitok-iz-revenya-i-klubniki',
    'prohladitelnyj-napitok-s-rozoj-karkade-myatoj-i-limonom',
    'fermented-baked-milk-homemade',
  ],
  'domashnie-sladosti': [
    'apple-jam',
    'marmalade-of-peaches',
    'homemade-candy-with-coconut',
    'figs-stuffed-with-chocolate',
    'prunes-in-chocolate',
    'prunes-in-batter',
    'walnuts-in-caramel',
    'sweet-sausage-with-nuts-and-raisins',
    'cukaty-iz-limonnyh-ili-apelsinovyh-korok',
    'domashnyaya-pastila-iz-yablok-i-yagod-v-elektrosushilke',
    'protein-cookies',
    'protein-cookies-with-coconut',
    'popkorn-v-domashnih-usloviyah-v-skovorode',
    'zapekanka-iz-makaron-s-tvorogom-i-chernoslivom',
    'zapekanka-iz-makaron-tvoroga-izyuma-i-chernoj-smorodiny',
  ],
  'tvorozhnaya-pasha': [
    'cheesecake-easter-custard',
    'chocolate-easter-torina',
    'cottage-cheese-pasca',
    'easter-cheese-finnish',
    'easter-cheesecake-with-nuts',
    'nezhnaya-aromatnaya-tvorozhnaya-pasha',
    'nezhnaya-tvorozhnaya-pasha-s-cukatami-i-izyumom',
    'tvorozhnaya-pasxa',
    'tvorozhnaya-zavarnaya-pasha-nezhnaya-i-vkusnaya',
  ],
  'tvorozhnye-deserty': [
    'desert-iz-tvoroga-i-izyuma-prosto-i-vkusno',
    'desert-iz-tvoroga-izyuma-i-kuragi-nezhnyj-i-vkusnyj',
    'desert-iz-tvoroga-izyuma-i-kuragi-v-shokoladnoj-glazuri',
    'molochnyj-desert-s-shokoladom-vkusnyj-i-appetitnyj',
    'vkusnyj-i-prostoj-desert',
    'desert-iz-pechenya-sgushennogo-moloka-i-orehov',
    'desert-iz-tykvy-vkusnyj-i-appetitnyj',
  ],
  'zhele-i-mussy': [
    'cherry-jelly',
    'klubnichnoe-zhele-so-smetanoj-nezhnoe-i-vkusnoe',
    'klubnichnyj-muss-iz-zhele-iz-paketika-i-zhelatina-poristyj-i-vozdushnyj',
    'vkusnyj-apelsinovyj-desert-iz-zhele-i-tvoroga',
    'vkusnyj-desert-iz-yablochnogo-zhele-i-limona',
    'zhele-iz-yagod-klubniki-i-zhimolosti-nezhnoe-i-vkusnoe',
    'zhele-iz-yagodnogo-pyure-i-yagod-klubniki',
  ],
  'zapechennye-yabloki-i-tykva': [
    'apples-stuffed-with-cottage-cheese',
    'nezhnye-i-sochnye-zapechennye-yabloki-s-tvorogom-i-izyumom',
    'vkusnyj-desert-iz-yablok-s-tvorogom-i-izyumom-zapechennyh-v-duhovke',
    'vkusnyj-desert-zapechennye-yabloki-s-tvorogom-i-slivochnym-maslom',
    'zapechennye-yabloki-s-vinogradom-v-duhovke',
    'zapechennye-yabloki-so-slivami-v-duhovke-prosto-i-vkusno',
    'tykva-s-limonom-i-saharom-zapechennaya-v-duhovke',
    'zapechennaya-tykva-s-yablokami-vinogradom-i-yajcami-v-duhovke',
    'zapechennaya-tykva-v-duhovke-s-saharom-ili-myodom-vkusno-i-polezno',
  ],
  'kashi-i-plov': [
    'plov-s-tykvoj-i-fruktami-poleznyj-i-vkusnyj',
    'prostoj-recept-tykvennoj-kashi-s-mannoj-krupoj-i-izyumom',
    'prostoj-recept-tykvennoj-kashi-s-pshenom-izyumom-i-yagodami-maliny',
    'pumpkin-porridge-with-millet',
    'tykvennaya-kasha-s-pshenom-i-yablokami',
    'tykvennaya-kasha-s-risom',
    'kutya-iz-risa-i-suhofruktov',
    'sladkaya-kutya-iz-grechki-meda-i-suhofruktov',
  ],
  'cakes': [
    'cake-potato',
    'cakes-potato-sugar',
    'cakes-potato-with-coconut',
    'cakes-potato-with-condensed-milk',
    'domashnie-pirozhnye-kartoshka-s-orehami-i-izyumom',
    'domashnie-pirozhnye-«kartoshka»-vkusno-i-prosto',
    'souffle-birds-milk',
  ],
  'entrees': [
    'fruktovyij-sup-s-suxofruktami-i-pshenom',
  ],
  'sousy-i-zagotovki': [
    'homemade-sour-cream',
  ],
}

const DRINKS_REDIRECTS = Object.entries(DRINKS_MOVES).flatMap(([category, aliases]) =>
  aliases.map((alias) => ({
    source: `/drinks/${alias}`,
    destination: `/${category}/${alias}`,
    permanent: true
  }))
)
// total:
75

module.exports = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: IMAGE_DOMAINS.split(',').filter(Boolean).flatMap((hostname) => [
      { protocol: 'http', hostname },
      { protocol: 'https', hostname }
    ])
  },
  async redirects() {
    return [
      ...SALAD_REDIRECTS,
      ...SOUP_REDIRECTS,
      ...MAIN_DISH_REDIRECTS,
      ...BAKING_REDIRECTS,
      ...CONSERVATION_REDIRECTS,
      ...DRINKS_REDIRECTS,
      {
        source: '/main-dishes',
        destination: '/second-courses',
        permanent: true
      },
      {
        source: '/baking',
        destination: '/vypechka',
        permanent: true
      },
      {
        source: '/assets/:slug',
        destination: '/files/:slug',
        permanent: true
      },
      {
        source: '/cooking/:category/:article',
        destination: '/:category/:article',
        permanent: true
      },
      {
        source: '/cooking/:category',
        destination: '/:category',
        permanent: true
      },
      {
        source: '/pages/:slug',
        destination: '/:slug',
        permanent: true
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/rss',
        destination: '/api/rss'
      },
      {
        source: '/files/:key',
        destination: '/api/files/:key'
      }
    ]
  }
}

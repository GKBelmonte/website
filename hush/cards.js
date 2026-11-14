// One card per line: the word to describe, then seven words the describer may not say.
// The game shows the first 5, 6 or 7 of them, so the strongest hints come first.
const CARDS = `
Elephant|trunk,big,grey,tusks,Africa,ears,ivory
Giraffe|neck,tall,spots,Africa,long,leaves,zoo
Penguin|bird,ice,Antarctica,waddle,black,white,cold
Kangaroo|Australia,jump,pouch,hop,joey,tail,marsupial
Dolphin|ocean,smart,swim,fin,jump,whale,mammal
Octopus|eight,arms,tentacles,sea,ink,legs,squid
Owl|bird,night,wise,hoot,eyes,head,nocturnal
Bat|fly,night,cave,vampire,wings,blind,upside
Camel|desert,hump,sand,water,ride,Sahara,spit
Zebra|stripes,horse,black,white,Africa,crossing,safari
Squirrel|nuts,tree,tail,acorn,rodent,park,bushy
Beaver|dam,teeth,wood,tail,river,Canada,build
Skunk|smell,stink,black,white,stripe,spray,odor
Hedgehog|spikes,small,ball,roll,quills,prickly,blue
Flamingo|pink,bird,leg,stand,shrimp,lawn,tall
Peacock|feathers,tail,colourful,bird,proud,blue,display
Parrot|bird,talk,repeat,pirate,colourful,shoulder,cracker
Shark|fish,teeth,fin,ocean,bite,attack,jaws
Whale|ocean,big,mammal,blue,blowhole,huge,swim
Crocodile|alligator,teeth,river,reptile,swamp,tears,snap
Turtle|shell,slow,reptile,sea,tortoise,green,eggs
Snake|slither,reptile,venom,hiss,legs,bite,long
Frog|green,jump,pond,tadpole,croak,prince,lily
Spider|web,eight,legs,bug,arachnid,silk,scary
Bee|honey,sting,buzz,hive,yellow,flower,queen
Butterfly|wings,caterpillar,cocoon,insect,flutter,colourful,stomach
Ant|small,insect,colony,hill,picnic,queen,work
Mosquito|bite,blood,itch,buzz,summer,insect,malaria
Wolf|howl,pack,moon,dog,wild,grey,forest
Fox|red,sly,tail,cunning,hunt,orange,den
Bear|honey,brown,polar,grizzly,hibernate,claws,teddy
Lion|king,mane,roar,jungle,cat,pride,Africa
Tiger|stripes,cat,orange,jungle,big,India,roar
Monkey|banana,tree,swing,ape,climb,tail,zoo
Gorilla|ape,big,chest,jungle,strong,silverback,primate
Rabbit|bunny,carrot,ears,hop,Easter,hat,fluffy
Mouse|small,cheese,cat,rodent,computer,squeak,trap
Horse|ride,saddle,gallop,pony,stable,race,mane
Cow|milk,moo,farm,beef,grass,udder,cattle
Pig|pink,mud,bacon,farm,oink,pork,snout
Sheep|wool,lamb,count,farm,flock,baa,shepherd
Chicken|egg,hen,farm,cluck,wings,rooster,scared
Duck|quack,pond,bird,bill,water,rubber,feathers
Swan|white,bird,lake,neck,graceful,ugly,ballet
Eagle|bird,bald,America,fly,talons,prey,soar
Lobster|red,claws,sea,expensive,shell,boil,seafood
Crab|claws,sideways,beach,shell,pinch,sea,walk
Jellyfish|sting,sea,transparent,tentacles,float,beach,wobble
Snail|slow,shell,slime,garden,escargot,trail,slug
Dinosaur|extinct,fossil,Jurassic,big,reptile,ancient,rex
Dragon|fire,wings,knight,myth,scales,breathe,treasure
Unicorn|horn,horse,magic,rainbow,myth,white,startup
Pizza|cheese,Italy,slice,pepperoni,dough,oven,delivery
Hamburger|bun,beef,patty,fries,fast,cheese,grill
Sushi|Japan,rice,fish,raw,roll,chopsticks,seaweed
Spaghetti|pasta,Italy,noodles,sauce,meatballs,long,fork
Taco|Mexico,shell,Tuesday,beef,salsa,tortilla,fold
Pancake|flat,syrup,breakfast,flip,batter,stack,maple
Waffle|syrup,breakfast,grid,iron,Belgium,squares,batter
Omelette|eggs,fold,breakfast,pan,cheese,French,whisk
Sandwich|bread,lunch,slices,ham,between,filling,sub
Salad|lettuce,healthy,green,dressing,vegetables,bowl,toss
Soup|bowl,spoon,hot,broth,liquid,chicken,can
Bread|loaf,bake,slice,toast,flour,wheat,butter
Cheese|dairy,milk,mouse,cheddar,yellow,slice,holes
Chocolate|sweet,cocoa,bar,brown,candy,dark,milk
Ice cream|cold,cone,scoop,vanilla,frozen,dessert,summer
Cake|birthday,candles,bake,slice,frosting,dessert,sweet
Cookie|biscuit,chip,bake,sweet,monster,browser,dough
Doughnut|hole,ring,glazed,police,fried,sweet,sprinkles
Popcorn|movie,corn,butter,kernel,microwave,cinema,salty
Pretzel|twist,salt,knot,German,bake,snack,beer
Honey|bee,sweet,sticky,hive,golden,bear,jar
Jam|fruit,spread,toast,jar,strawberry,jelly,traffic
Peanut butter|spread,jelly,nut,sandwich,sticky,jar,crunchy
Ketchup|tomato,red,sauce,fries,bottle,mustard,squeeze
Mustard|yellow,hot dog,sauce,ketchup,seed,Dijon,spicy
Salt|pepper,season,sea,shaker,white,sodium,taste
Pepper|salt,black,spice,grind,sneeze,season,hot
Sugar|sweet,white,cube,cane,coffee,candy,diabetes
Garlic|vampire,clove,smell,breath,onion,bread,bulb
Onion|cry,layers,tears,chop,rings,vegetable,peel
Potato|fries,mash,chip,vegetable,spud,couch,Ireland
Tomato|red,fruit,vegetable,ketchup,sauce,salad,vine
Carrot|orange,rabbit,vegetable,root,eyesight,stick,crunchy
Broccoli|green,tree,vegetable,healthy,florets,kids,steam
Corn|cob,yellow,kernel,maize,field,pop,sweet
Mushroom|fungus,toadstool,cap,pizza,forest,grow,stem
Pumpkin|Halloween,orange,carve,pie,October,lantern,squash
Avocado|green,toast,guacamole,pit,millennial,fruit,Mexico
Banana|yellow,monkey,peel,fruit,slip,bunch,split
Apple|fruit,red,doctor,tree,pie,iPhone,core
Orange|fruit,juice,colour,citrus,peel,vitamin,Florida
Lemon|sour,yellow,citrus,juice,squeeze,lime,tea
Strawberry|red,berry,seeds,cream,fruit,jam,Wimbledon
Grape|wine,vine,purple,bunch,raisin,fruit,green
Watermelon|red,seeds,summer,green,fruit,juicy,slice
Pineapple|tropical,spiky,Hawaii,pizza,yellow,fruit,rings
Coconut|palm,tropical,milk,shell,hard,island,hairy
Cherry|red,pit,stem,top,blossom,pie,fruit
Coffee|caffeine,morning,bean,cup,espresso,brew,black
Tea|leaves,cup,hot,bag,England,kettle,green
Milk|cow,white,dairy,cereal,drink,carton,calcium
Wine|grape,red,white,bottle,glass,vineyard,cork
Beer|pint,hops,brew,pub,lager,foam,drunk
Champagne|bubbles,France,toast,celebrate,cork,sparkling,wine
Cocktail|drink,mix,bar,shake,umbrella,alcohol,martini
Smoothie|blend,fruit,drink,healthy,straw,thick,banana
Cereal|breakfast,milk,bowl,box,flakes,morning,spoon
Bacon|pig,breakfast,crispy,strips,eggs,pork,fry
Steak|beef,grill,rare,cow,medium,knife,sirloin
Curry|India,spicy,rice,sauce,yellow,hot,naan
Burrito|Mexico,wrap,tortilla,beans,rice,roll,Chipotle
Fries|potato,French,salt,ketchup,fast,chips,deep
Chewing gum|bubble,mint,stick,chew,blow,shoe,breath
Lollipop|stick,lick,candy,sweet,suck,round,sucker
Marshmallow|campfire,roast,white,soft,fluffy,sweet,smores
Paris|France,Eiffel,city,love,Louvre,baguette,capital
London|England,Big Ben,capital,Thames,queen,Britain,fog
New York|apple,Manhattan,city,Liberty,Broadway,Times,skyscraper
Tokyo|Japan,capital,city,sushi,Asia,neon,Godzilla
Rome|Italy,Colosseum,capital,Pope,empire,ancient,day
Egypt|pyramids,Nile,pharaoh,Cairo,Africa,mummy,desert
Australia|kangaroo,Sydney,down under,koala,continent,outback,island
Canada|maple,north,hockey,cold,Toronto,sorry,moose
Brazil|Rio,samba,football,Amazon,carnival,South America,Portuguese
China|Beijing,wall,Asia,panda,population,dragon,Mandarin
India|curry,Taj Mahal,Delhi,Asia,Bollywood,Ganges,cricket
Mexico|taco,tequila,sombrero,Cancun,border,Spanish,cactus
Hawaii|island,hula,volcano,surf,aloha,Pacific,lei
Antarctica|south,ice,penguin,cold,pole,continent,frozen
Sahara|desert,sand,Africa,hot,camel,dry,dunes
Amazon|river,rainforest,Brazil,jungle,online,Bezos,delivery
Mount Everest|tallest,climb,Nepal,Himalayas,peak,summit,Sherpa
Niagara Falls|water,Canada,barrel,border,honeymoon,cascade,boat
Hollywood|movies,sign,California,stars,Los Angeles,film,actors
Las Vegas|casino,gamble,Nevada,desert,stays,strip,Elvis
Venice|canals,Italy,gondola,water,sinking,boats,masks
Airport|plane,fly,terminal,luggage,security,gate,runway
Hospital|doctor,nurse,sick,patient,emergency,surgery,ward
Library|books,quiet,borrow,read,shelves,card,study
Museum|art,exhibit,history,paintings,old,gallery,dinosaur
School|teacher,students,learn,class,education,homework,kids
University|degree,college,students,professor,campus,study,lecture
Church|pray,Sunday,priest,religion,God,wedding,steeple
Castle|king,knight,moat,medieval,tower,princess,fortress
Prison|jail,bars,criminal,cell,inmate,guard,locked
Zoo|animals,cages,visit,lion,keeper,monkey,exhibit
Circus|clown,tent,acrobat,ring,elephant,juggle,trapeze
Casino|gamble,slots,poker,chips,Vegas,money,roulette
Supermarket|groceries,shop,cart,aisle,food,checkout,store
Restaurant|eat,waiter,menu,food,dinner,chef,table
Bakery|bread,cake,oven,pastry,flour,dough,shop
Pharmacy|drugs,medicine,prescription,pills,chemist,store,doctor
Gym|exercise,workout,weights,fitness,treadmill,muscles,membership
Beach|sand,sea,sun,waves,towel,swim,shore
Desert|sand,dry,hot,cactus,camel,oasis,Sahara
Jungle|trees,rainforest,Tarzan,wild,monkey,vines,tropical
Island|water,surrounded,tropical,desert,palm,stranded,ocean
Volcano|lava,erupt,mountain,magma,ash,hot,Hawaii
Cave|dark,bat,rock,underground,hole,explore,bear
Farm|animals,tractor,barn,crops,cow,field,country
Lighthouse|ship,beam,coast,tower,warn,rocks,keeper
Bridge|cross,river,over,golden gate,span,connect,cards
Skyscraper|tall,building,city,floors,elevator,tower,glass
Elevator|lift,floors,up,down,button,building,stairs
Basement|downstairs,cellar,under,house,dark,storage,below
Attic|roof,upstairs,storage,house,top,dusty,loft
Kitchen|cook,room,stove,fridge,food,sink,chef
Bathroom|toilet,shower,sink,wash,room,tub,mirror
Garage|car,park,door,house,tools,mechanic,band
Umbrella|rain,wet,open,dry,handle,Rihanna,weather
Mirror|reflection,glass,look,face,wall,vanity,seven years
Clock|time,hands,tick,hour,wall,alarm,watch
Candle|wax,flame,wick,light,birthday,burn,blow
Pillow|head,sleep,bed,soft,feather,fight,cushion
Blanket|warm,bed,cover,cold,wool,sleep,cozy
Toothbrush|teeth,paste,dentist,clean,bristles,mouth,morning
Soap|wash,clean,bubbles,bar,hands,lather,opera
Towel|dry,bath,shower,beach,wet,cloth,hitchhiker
Scissors|cut,paper,blades,rock,sharp,hair,snip
Hammer|nail,hit,tool,bang,Thor,wood,build
Screwdriver|tool,turn,Phillips,screw,flat,twist,vodka
Ladder|climb,rungs,steps,high,up,bad luck,reach
Key|lock,door,open,car,ring,piano,turn
Wallet|money,cards,pocket,cash,leather,purse,lost
Backpack|bag,school,carry,shoulders,straps,hike,books
Suitcase|luggage,travel,pack,trip,bag,airport,clothes
Glasses|eyes,see,lenses,wear,vision,frames,sun
Watch|time,wrist,clock,wear,look,strap,smart
Ring|finger,wedding,jewelry,gold,diamond,phone,circle
Necklace|neck,jewelry,chain,pendant,wear,pearls,gold
Hat|head,wear,cap,sun,brim,magician,top
Scarf|neck,winter,warm,wrap,knit,wool,cold
Shoes|feet,wear,laces,pair,walk,sneakers,sole
Jeans|denim,blue,pants,Levi,trousers,pockets,wear
Tie|neck,suit,knot,formal,shirt,bow,wear
Pyjamas|sleep,bed,night,wear,clothes,comfy,party
Bikini|beach,swim,two,piece,summer,pool,suit
Chair|sit,legs,seat,table,furniture,back,office
Sofa|couch,sit,living room,cushions,furniture,TV,lounge
Bed|sleep,mattress,pillow,night,bunk,sheets,lie
Lamp|light,bulb,shade,desk,switch,genie,bright
Carpet|floor,rug,red,magic,vacuum,soft,fly
Window|glass,see,open,pane,Microsoft,view,wall
Fridge|cold,food,kitchen,freezer,magnet,cool,milk
Oven|bake,hot,kitchen,cook,stove,cake,roast
Microwave|heat,food,popcorn,ding,quick,kitchen,radiation
Toaster|bread,pop,breakfast,burn,slices,kitchen,brown
Kettle|boil,water,tea,whistle,steam,hot,electric
Washing machine|clothes,laundry,spin,clean,detergent,dryer,cycle
Vacuum cleaner|suck,dust,floor,hoover,carpet,noise,Dyson
Fork|knife,eat,prongs,spoon,cutlery,road,stab
Bottle|water,drink,glass,plastic,cap,baby,message
Broom|sweep,floor,witch,brush,dust,fly,stick
Envelope|letter,mail,stamp,seal,send,paper,lick
Newspaper|read,news,daily,print,headline,paper,press
Book|read,pages,author,library,cover,novel,chapter
Dictionary|words,definitions,meaning,look up,alphabetical,spell,Oxford
Pencil|write,lead,eraser,sharpen,draw,wood,pen
Calculator|math,numbers,add,buttons,sum,compute,digits
Calendar|dates,months,days,year,schedule,wall,advent
Map|directions,world,find,atlas,treasure,navigate,Google
Compass|north,direction,needle,navigate,magnetic,points,lost
Telescope|stars,space,look,astronomy,far,lens,Galileo
Microscope|small,lens,cells,lab,magnify,science,slide
Magnet|attract,metal,fridge,poles,stick,iron,pull
Battery|power,charge,energy,dead,AA,phone,electric
Flashlight|torch,light,dark,beam,batteries,shine,camping
Camera|photo,picture,lens,snap,flash,film,selfie
Television|watch,screen,shows,remote,channel,TV,box
Radio|listen,music,station,FM,broadcast,car,waves
Headphones|ears,music,listen,wireless,sound,buds,noise
Microphone|sing,speak,voice,loud,karaoke,drop,record
Guitar|strings,strum,rock,acoustic,electric,instrument,chords
Piano|keys,black,white,instrument,grand,play,pedal
Drums|beat,sticks,hit,rhythm,band,kit,percussion
Violin|strings,bow,fiddle,orchestra,instrument,chin,classical
Trumpet|brass,blow,horn,jazz,instrument,valves,loud
Flute|blow,wind,instrument,holes,magic,silver,pipe
Balloon|air,pop,party,helium,inflate,float,hot
Kite|fly,wind,string,sky,tail,diamond,paper
Puzzle|pieces,jigsaw,solve,fit,picture,box,crossword
Dice|roll,six,cube,gamble,numbers,board,dots
Doll|toy,girl,Barbie,play,dress,baby,house
Teddy bear|stuffed,toy,cuddle,soft,child,fluffy,plush
Swing|playground,push,back,forth,park,seat,golf
Trampoline|jump,bounce,springs,garden,flip,net,high
Skateboard|wheels,ride,tricks,board,Tony Hawk,ramp,deck
Bicycle|pedal,wheels,ride,two,cycle,helmet,chain
Motorcycle|bike,engine,helmet,two,wheels,Harley,ride
Car|drive,wheels,engine,road,vehicle,auto,garage
Train|tracks,rail,station,locomotive,carriage,conductor,choo
Subway|underground,metro,train,tunnel,city,sandwich,tube
Airplane|fly,wings,pilot,sky,airport,jet,passengers
Helicopter|blades,fly,rotor,chopper,hover,pilot,spin
Rocket|space,launch,NASA,fuel,moon,astronaut,blast
Boat|water,sail,float,ship,row,fishing,captain
Submarine|underwater,navy,yellow,periscope,dive,deep,sandwich
Ambulance|siren,hospital,emergency,paramedic,injured,flashing,911
Fire truck|red,siren,hose,ladder,engine,emergency,blaze
Taxi|cab,yellow,driver,fare,ride,meter,Uber
Traffic light|red,green,stop,go,yellow,signal,intersection
Parachute|jump,plane,sky,fall,open,dive,cord
Anchor|ship,boat,heavy,chain,drop,sea,news
Tent|camping,sleep,pitch,pegs,outdoors,canvas,circus
Sleeping bag|camping,tent,zip,warm,night,outdoors,roll
Fishing rod|hook,line,catch,reel,bait,cast,pole
Doctor|hospital,sick,medicine,nurse,patient,physician,stethoscope
Nurse|hospital,doctor,care,patient,uniform,medical,shift
Dentist|teeth,drill,cavity,mouth,filling,chair,floss
Teacher|school,students,class,learn,lesson,homework,educate
Lawyer|court,law,attorney,judge,sue,case,defend
Judge|court,gavel,law,sentence,robe,trial,verdict
Police officer|cop,arrest,badge,law,crime,uniform,siren
Firefighter|blaze,hose,rescue,truck,burn,helmet,hero
Pilot|plane,fly,cockpit,captain,airline,wings,TV
Astronaut|space,NASA,moon,rocket,suit,orbit,gravity
Chef|cook,kitchen,restaurant,food,hat,Ramsay,recipe
Waiter|restaurant,serve,tip,order,table,food,menu
Farmer|crops,tractor,field,animals,barn,grow,harvest
Plumber|pipes,leak,toilet,water,fix,Mario,drain
Electrician|wires,power,fix,shock,current,fuse,sparky
Carpenter|wood,build,hammer,furniture,saw,nails,Jesus
Mechanic|car,fix,engine,garage,repair,tools,oil
Barber|hair,cut,shave,scissors,men,pole,shop
Hairdresser|cut,salon,style,scissors,colour,blow,stylist
Tailor|sew,clothes,suit,fit,needle,alter,Swift
Butcher|meat,cut,shop,cleaver,beef,apron,chop
Fisherman|catch,boat,net,rod,sea,hook,bait
Photographer|camera,pictures,shoot,lens,wedding,portrait,flash
Journalist|news,write,reporter,paper,story,interview,press
Author|book,write,novel,writer,publish,story,pen
Actor|movie,play,stage,role,film,Hollywood,perform
Singer|voice,song,music,microphone,vocal,concert,band
Dancer|ballet,move,music,stage,choreography,perform,feet
Magician|trick,rabbit,hat,wand,illusion,cards,abracadabra
Clown|circus,nose,funny,red,makeup,laugh,scary
Pirate|ship,treasure,eye patch,parrot,sea,captain,arr
Ninja|Japan,black,stealth,sword,assassin,turtle,silent
Knight|armour,sword,horse,medieval,king,sir,castle
King|queen,crown,throne,royal,rule,monarch,castle
Queen|king,crown,royal,Elizabeth,monarch,throne,bee
Princess|prince,castle,royal,Disney,crown,daughter,tiara
President|leader,country,elect,White House,vote,chief,USA
Soldier|army,war,fight,uniform,military,gun,troop
Spy|secret,agent,Bond,undercover,007,espionage,sneak
Detective|solve,crime,clues,Sherlock,mystery,investigate,police
Thief|steal,rob,burglar,crime,take,mask,night
Scientist|lab,experiment,research,coat,discover,theory,chemistry
Engineer|build,design,math,bridge,train,technical,software
Architect|design,building,plans,blueprint,draw,house,structure
Accountant|numbers,taxes,money,books,finance,audit,spreadsheet
Librarian|books,quiet,shh,shelves,borrow,glasses,read
Lifeguard|pool,beach,save,drown,swim,whistle,rescue
Babysitter|kids,watch,parents,night,teenager,care,nanny
Referee|whistle,game,rules,foul,stripes,card,umpire
Coach|team,train,sports,bus,whistle,manager,play
Cowboy|horse,hat,west,boots,ranch,lasso,rodeo
Vampire|blood,Dracula,fangs,bite,bat,garlic,undead
Zombie|undead,brains,walking,apocalypse,bite,dead,slow
Ghost|spirit,haunt,dead,boo,sheet,scary,invisible
Witch|broom,spell,cauldron,hat,magic,Halloween,wicked
Wizard|magic,wand,spell,beard,Harry,Gandalf,robe
Mermaid|fish,tail,sea,Ariel,woman,swim,siren
Robot|machine,metal,artificial,android,beep,program,automated
Alien|space,UFO,green,extraterrestrial,planet,Mars,abduct
Superhero|cape,powers,save,Marvel,villain,mask,comic
Football|ball,goal,kick,soccer,touchdown,pitch,team
Basketball|hoop,dribble,NBA,court,bounce,dunk,tall
Tennis|racket,net,serve,court,Wimbledon,ball,love
Golf|club,hole,green,tee,Tiger,course,putt
Baseball|bat,pitch,home run,diamond,base,strike,glove
Hockey|ice,puck,stick,skate,Canada,goal,rink
Boxing|punch,ring,gloves,fight,knockout,round,Rocky
Swimming|pool,water,stroke,lap,dive,float,goggles
Surfing|waves,board,ocean,beach,ride,Hawaii,internet
Skiing|snow,mountain,slope,poles,winter,lift,downhill
Ice skating|rink,blades,frozen,glide,figure,winter,cold
Bowling|pins,strike,ball,alley,lane,spare,ten
Yoga|stretch,mat,pose,meditate,flexible,downward,breathe
Karate|martial,belt,chop,kick,Japan,kid,black
Marathon|run,race,long,miles,distance,26,finish
Olympics|games,gold,medal,rings,athletes,four years,torch
Chess|board,king,checkmate,pawn,queen,game,knight
Poker|cards,bet,bluff,chips,face,casino,flush
Darts|board,throw,bullseye,pub,arrow,180,target
Camping|tent,outdoors,fire,woods,sleep,nature,marshmallow
Hiking|walk,trail,mountain,boots,nature,backpack,trek
Gardening|plants,flowers,soil,grow,dig,weeds,hose
Knitting|needles,wool,yarn,sweater,grandma,stitch,scarf
Painting|brush,canvas,art,colours,picture,wall,artist
Karaoke|sing,microphone,bar,lyrics,song,Japan,screen
Juggling|balls,throw,catch,circus,three,air,clown
Wedding|bride,groom,marry,ring,dress,cake,vows
Birthday|cake,candles,party,age,presents,year,born
Christmas|Santa,December,tree,presents,holiday,Jesus,snow
Halloween|pumpkin,costume,October,candy,trick,scary,treat
Easter|bunny,eggs,spring,chocolate,Sunday,hunt,resurrection
Thanksgiving|turkey,November,pilgrims,grateful,dinner,family,America
Valentine|love,heart,February,roses,card,cupid,romantic
Honeymoon|wedding,trip,newlyweds,vacation,couple,after,romantic
Funeral|dead,coffin,bury,black,mourn,cemetery,grave
Picnic|basket,blanket,park,outdoors,food,ants,sandwiches
Barbecue|grill,meat,outdoors,summer,charcoal,sauce,smoke
Fireworks|explode,sky,colours,July,bang,New Year,night
Parade|march,floats,street,band,celebrate,crowd,Macy
Vacation|holiday,trip,travel,relax,beach,time off,break
Sun|star,hot,bright,day,sky,shine,yellow
Moon|night,sky,full,crescent,astronaut,cheese,lunar
Star|sky,night,twinkle,shine,famous,five,wish
Planet|Earth,Mars,orbit,space,solar,world,sphere
Rainbow|colours,rain,pot,gold,arc,sky,seven
Cloud|sky,white,rain,fluffy,storage,grey,nine
Rain|wet,drops,umbrella,cloud,water,storm,fall
Snow|white,cold,winter,flake,ski,man,ice
Thunder|lightning,storm,loud,boom,sound,rumble,Thor
Lightning|thunder,bolt,storm,flash,strike,electric,sky
Tornado|twister,wind,spin,funnel,storm,Kansas,destroy
Hurricane|storm,wind,eye,tropical,cyclone,category,flood
Earthquake|shake,ground,fault,Richter,tremor,quake,California
Fire|hot,burn,flame,smoke,red,wood,match
Ocean|sea,water,waves,Pacific,salt,deep,blue
River|water,flow,stream,bank,Nile,fish,current
Waterfall|cascade,river,cliff,drop,Niagara,flow,splash
Mountain|high,climb,peak,snow,hill,range,summit
Forest|trees,woods,green,animals,rain,wild,dense
Tree|leaves,trunk,branch,wood,roots,forest,climb
Flower|petals,bloom,garden,rose,smell,bouquet,plant
Rose|red,thorns,flower,love,Valentine,petals,smell
Cactus|desert,spikes,prickly,plant,dry,needles,green
Diamond|ring,gem,hard,sparkle,expensive,carat,engagement
Gold|metal,yellow,medal,jewelry,rich,bar,first
Shadow|dark,light,follow,shape,sun,behind,cast
Echo|repeat,sound,cave,bounce,voice,shout,Alexa
Gravity|fall,Newton,apple,down,force,weight,pull
Summer|hot,season,sun,beach,vacation,July,warm
Winter|cold,snow,season,December,ice,freeze,coat
Heart|love,beat,blood,chest,red,pump,organ
Brain|think,head,smart,mind,skull,organ,neurons
Stomach|belly,food,digest,tummy,ache,hungry,abs
Skeleton|bones,body,skull,Halloween,spine,frame,ribs
Tongue|mouth,taste,lick,speak,pink,twister,buds
Elbow|arm,bend,joint,funny,bone,macaroni,grease
Thumb|finger,hand,up,hitchhike,opposable,green,suck
Beard|face,hair,chin,shave,man,moustache,Santa
Belly button|navel,stomach,lint,innie,outie,middle,piercing
Fingerprint|unique,touch,crime,ink,identity,scan,swirl
Sneeze|nose,achoo,bless,cold,tissue,allergy,pepper
Hiccup|breath,scare,jump,diaphragm,hold,water,sound
Yawn|tired,mouth,sleepy,bored,contagious,open,stretch
Snore|sleep,noise,nose,loud,night,breathe,partner
Blush|red,cheeks,embarrassed,face,shy,makeup,pink
Sweat|hot,exercise,wet,perspire,smell,gym,nervous
Headache|pain,aspirin,migraine,hurt,temple,throb,stress
Sunburn|red,skin,beach,lotion,peel,hot,UV
Vaccine|needle,shot,immune,jab,disease,arm,prevent
Dream|sleep,night,nightmare,wish,imagine,REM,Martin Luther
Computer|laptop,screen,keyboard,PC,mouse,type,program
Internet|web,online,browse,WiFi,net,connect,Google
Smartphone|mobile,call,apps,screen,iPhone,touch,cell
Email|send,inbox,message,electronic,address,spam,Gmail
Password|secret,login,security,code,forgot,username,123
Keyboard|type,keys,computer,QWERTY,piano,letters,enter
Selfie|photo,phone,yourself,camera,stick,picture,front
Emoji|smiley,face,text,icon,yellow,message,symbol
Hashtag|pound,Twitter,trending,symbol,tag,number,social
Podcast|listen,episode,audio,host,subscribe,radio,Spotify
Drone|fly,remote,camera,unmanned,propellers,buzz,military
Satellite|orbit,space,dish,signal,GPS,moon,launch
Virus|sick,computer,infect,flu,spread,germ,corona
Video game|play,console,controller,Nintendo,level,screen,Xbox
Remote control|TV,buttons,channel,change,couch,batteries,lost
Alarm clock|wake,morning,ring,snooze,time,buzz,early
Movie|film,cinema,watch,actor,popcorn,Hollywood,screen
Cartoon|animated,drawing,kids,Saturday,Disney,funny,characters
Comedy|funny,laugh,joke,stand up,humour,sitcom,comedian
Horror|scary,fear,scream,monster,blood,film,fright
Musical|sing,Broadway,stage,dance,songs,theatre,show
Opera|sing,soprano,Italian,loud,fat lady,house,classical
Ballet|dance,tutu,toes,swan,pointe,graceful,Nutcracker
Orchestra|conductor,instruments,symphony,classical,violins,musicians,pit
Concert|music,live,band,stage,tickets,crowd,show
Villain|bad,evil,hero,enemy,antagonist,guy,plot
Fairy tale|story,once upon,princess,Grimm,happily,children,magic
Riddle|puzzle,question,solve,answer,guess,trick,Sphinx
Joke|funny,laugh,punchline,tell,knock,humour,comedian
Secret|tell,hidden,keep,whisper,confidential,nobody,private
Lie|truth,false,dishonest,fib,Pinocchio,down,detector
Promise|keep,swear,word,pinky,vow,break,commit
Surprise|unexpected,party,shock,gift,jump,secret,wow
Nightmare|bad,dream,sleep,scary,Elm Street,wake,horror
Memory|remember,forget,past,brain,recall,computer,photo
Luck|fortune,chance,clover,good,bad,charm,seven
Courage|brave,fear,lion,heart,bold,hero,guts
Jealousy|envy,green,want,partner,covet,monster,resent
Nostalgia|past,memories,remember,old,miss,childhood,sentimental
Freedom|liberty,free,independence,chains,rights,speech,prison
Justice|law,fair,court,scales,blind,league,right
Peace|war,dove,quiet,calm,sign,hippie,treaty
Democracy|vote,people,elect,government,Greece,majority,ballot
Election|vote,ballot,candidate,president,campaign,poll,win
Mortgage|house,loan,bank,pay,interest,home,debt
Retirement|old,work,pension,stop,sixty-five,golf,senior
Interview|job,questions,hire,candidate,talk,resume,journalist
Deadline|due,date,late,time,finish,work,submit
Homework|school,teacher,after,assignment,dog ate,study,due
Exam|test,study,school,pass,fail,grade,questions
Recipe|cook,ingredients,instructions,food,book,steps,follow
Diet|food,weight,lose,eat,calories,healthy,slim
Allergy|sneeze,peanuts,reaction,pollen,itch,hives,hay fever
Hangover|drunk,morning,headache,alcohol,after,sick,movie
Traffic jam|cars,stuck,slow,road,rush hour,horn,highway
Road trip|car,drive,travel,highway,vacation,snacks,long
Jet lag|tired,travel,time zone,flight,sleep,plane,long haul
Passport|travel,country,border,photo,visa,stamp,ID
Souvenir|gift,trip,remember,shop,tourist,keepsake,magnet
Postcard|send,vacation,picture,stamp,mail,wish,here
Treasure|pirate,chest,gold,map,bury,hunt,X
Lottery|win,numbers,ticket,jackpot,money,millions,draw
Tattoo|ink,skin,needle,permanent,arm,parlour,design
Haircut|barber,scissors,trim,short,salon,style,bangs
Makeup|face,lipstick,mascara,cosmetics,foundation,apply,beauty
Perfume|smell,spray,scent,fragrance,bottle,cologne,Chanel
Laundry|clothes,wash,dirty,machine,fold,dry,detergent
Recycling|bin,plastic,reuse,green,paper,environment,sort
Hide and seek|count,find,game,children,ready or not,look,conceal
Tug of war|rope,pull,teams,game,mud,strength,line
Rock paper scissors|game,hands,beats,shoot,choose,three,decide
Musical chairs|game,sit,stop,party,one less,round,song
Pillow fight|feathers,bed,hit,sleepover,soft,cushion,swing
High five|hand,slap,up,celebrate,palm,top,great
Whisper|quiet,secret,ear,soft,speak,low,hush
Whistle|blow,lips,referee,tune,sound,dog,train
Applause|clap,hands,audience,cheer,ovation,praise,end
Autograph|sign,famous,celebrity,signature,pen,fan,name
Rice|grain,white,Asia,paddy,sushi,boil,brown
Door|open,close,knock,handle,enter,room,lock
Socks|feet,pair,shoes,lost,toes,wear,laundry
Lake|water,pond,swim,fresh,boat,shore,Michigan
`.trim().split('\n').map(line => {
  const [word, banned] = line.split('|');
  return { word, banned: banned.split(',') };
});

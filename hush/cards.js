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
Rizz|charm,flirt,charisma,game,attract,smooth,pickup
Slay|kill,great,queen,amazing,dragon,win,fierce
Ghosting|ignore,text,disappear,reply,dating,vanish,silent
Vibe check|mood,feeling,energy,test,pass,atmosphere,assess
Simp|crush,desperate,attention,obsessed,girl,pathetic,devoted
Cap|lie,hat,false,no,truth,fake,baseball
Yeet|throw,far,shout,toss,launch,hard,fling
Stan|fan,obsessed,Eminem,support,idol,love,superfan
Salty|bitter,upset,sea,annoyed,angry,taste,lost
Flex|show off,muscle,brag,bend,boast,weird,rich
Lowkey|secretly,quiet,kind of,subtle,slightly,high,modest
Sus|suspicious,Among Us,shady,impostor,trust,doubt,sketchy
Bussin|delicious,good,food,tasty,amazing,fire,yummy
Drip|style,outfit,water,fashion,clothes,tap,swag
Main character|protagonist,story,centre,attention,movie,energy,star
Touch grass|outside,online,internet,lawn,go,nature,log off
Doomscrolling|phone,news,bad,feed,endless,social media,night
Situationship|dating,undefined,relationship,casual,label,almost,commitment
Delulu|delusional,fantasy,unrealistic,believe,crazy,solulu,dreaming
Red flag|warning,dating,danger,bad sign,toxic,bull,relationship
Rave|party,dance,techno,night,warehouse,lights,electronic
DJ|music,decks,mix,spin,club,turntables,disc jockey
Techno|electronic,Berlin,beat,Detroit,four,repetitive,club
House music|Chicago,electronic,beat,dance,deep,home,club
Bass drop|beat,build up,dubstep,low,moment,loud,fall
Glow stick|light,crack,neon,shake,party,bracelet,dark
Music festival|stage,tent,Coachella,weekend,bands,camping,outdoor
Strobe light|flash,blink,epilepsy,club,fast,white,dance
Afterparty|late,morning,continue,club,house,sunrise,follow
Warehouse|storage,building,illegal,industrial,big,empty,boxes
Dubstep|bass,wobble,Skrillex,electronic,drop,London,heavy
Trance|hypnotic,electronic,uplifting,state,melody,Armin,daze
Drum and bass|fast,jungle,breakbeat,UK,electronic,percussion,low
Turntable|vinyl,record,spin,scratch,needle,deck,player
Subwoofer|speaker,low,boom,loud,sound,car,frequency
Laser|beam,light,green,pointer,cat,show,eye
Headliner|main,act,top,festival,last,poster,biggest
Lineup|artists,list,festival,poster,schedule,police,order
Wristband|entry,arm,festival,ticket,bracelet,access,VIP
Earplugs|hearing,loud,protect,foam,noise,sleep,tinnitus
Bouncer|door,club,security,ID,big,reject,guard
Guest list|name,door,free,entry,club,plus one,VIP
Nightclub|dance,disco,drinks,late,DJ,bouncer,queue
Smoke machine|fog,haze,stage,club,cloud,dry ice,effect
Remix|version,song,new,DJ,original,edit,rework
Vinyl|record,turntable,LP,spin,groove,black,analog
Ibiza|Spain,island,party,clubs,summer,Balearic,holiday
Glitter|sparkle,shiny,face,festival,craft,everywhere,sequins
Dance floor|club,move,disco,crowd,feet,wedding,boogie
Hangxiety|morning after,regret,drinking,worry,nervous,alcohol,dread
Metallica|Enter Sandman,thrash,Hetfield,black album,Lars,Master of Puppets,band
Iron Maiden|Eddie,British,Trooper,Bruce Dickinson,torture,heavy,band
Black Sabbath|Ozzy,Birmingham,Paranoid,first,Iommi,heavy,band
Slayer|thrash,Reign in Blood,Angel of Death,fast,killer,vampire,band
Megadeth|Mustaine,thrash,Peace Sells,million,Symphony,big four,band
Slipknot|masks,Iowa,nine,jumpsuits,Corey Taylor,numbers,band
Rammstein|German,fire,Du Hast,industrial,pyro,Till,band
Judas Priest|leather,Breaking the Law,Halford,British,betrayer,motorcycle,band
Motorhead|Lemmy,Ace of Spades,umlaut,loud,bass,speed,band
Pantera|Dimebag,Texas,Cowboys from Hell,Walk,panther,groove,band
Star Wars|Jedi,lightsaber,Darth Vader,force,Skywalker,galaxy,Yoda
Harry Potter|wizard,Hogwarts,scar,wand,Rowling,glasses,Voldemort
Batman|Gotham,Bruce Wayne,Joker,cape,dark knight,Robin,cave
Spider-Man|web,Peter Parker,bite,Marvel,swing,New York,wall
Barbie|doll,pink,Ken,Mattel,blonde,dreamhouse,Margot Robbie
Pokemon|Pikachu,catch,cards,trainer,Nintendo,Ash,ball
Mario|plumber,Nintendo,Luigi,mushroom,jump,moustache,kart
Taylor Swift|Eras,singer,Shake It Off,Kelce,country,albums,fans
Beyonce|Jay-Z,Destiny's Child,Single Ladies,queen,singer,Lemonade,hive
The Simpsons|Homer,Bart,yellow,Springfield,cartoon,doh,Marge
Game of Thrones|dragons,winter,Stark,iron chair,HBO,Jon Snow,Westeros
Lord of the Rings|hobbit,Frodo,Tolkien,Gandalf,Mordor,precious,Sauron
Netflix|streaming,chill,binge,series,red,subscription,watch
TikTok|videos,short,dance,app,scroll,for you,viral
Meme|funny,internet,picture,viral,share,caption,joke
Influencer|Instagram,followers,sponsored,social media,brand,content,famous
Reality TV|Kardashians,unscripted,Big Brother,drama,show,contestants,Survivor
Red carpet|celebrities,premiere,dress,Oscars,walk,photos,gala
Paparazzi|photographers,celebrities,camera,chase,Gaga,photos,tabloid
Super Bowl|football,halftime,NFL,commercials,February,final,ring
Director's cut|version,longer,extended,film,edit,original,release
Film noir|black and white,detective,shadows,femme fatale,crime,forties,dark
Cinematography|camera,shots,lighting,visual,lens,frame,DP
Screenplay|script,write,dialogue,movie,scenes,pages,writer
Close-up|face,shot,camera,near,zoom,tight,detail
Montage|sequence,training,clips,music,Rocky,edit,time
Plot twist|surprise,ending,unexpected,reveal,shock,story,Shyamalan
Subtitles|read,foreign,text,bottom,language,translation,captions
Cannes|France,festival,Palme d'Or,film,Riviera,May,premiere
Oscar|award,Academy,statue,gold,best picture,ceremony,Hollywood
Ramen|noodles,Japan,broth,instant,soup,slurp,bowl
Dumpling|dough,filling,steamed,Chinese,gyoza,wrap,pork
Kimchi|Korea,cabbage,fermented,spicy,side,jar,sour
Paella|Spain,rice,saffron,seafood,pan,Valencia,yellow
Croissant|France,pastry,butter,flaky,breakfast,crescent,bakery
Lasagna|pasta,layers,Italy,Garfield,sheets,baked,cheese
Hummus|chickpeas,dip,tahini,pita,Middle East,spread,garlic
Falafel|chickpeas,fried,balls,pita,Middle East,vegetarian,wrap
Guacamole|avocado,dip,Mexico,chips,green,lime,extra
Tiramisu|Italy,dessert,coffee,mascarpone,ladyfingers,cocoa,layers
Risotto|rice,Italy,creamy,stir,arborio,broth,mushroom
Poutine|fries,gravy,curds,Quebec,Canada,cheese,Montreal
Pho|Vietnam,noodles,soup,broth,beef,herbs,bowl
Tapas|Spain,small,plates,share,bar,snacks,appetizers
Kebab|skewer,meat,doner,grill,Turkey,late night,pita
Baguette|France,bread,long,stick,crusty,loaf,bakery
Sourdough|bread,starter,ferment,pandemic,loaf,tangy,yeast
Wasabi|green,sushi,spicy,Japan,horseradish,paste,nose
Tofu|soy,vegetarian,bean curd,white,block,vegan,protein
Brunch|breakfast,lunch,Sunday,mimosa,late,eggs,weekend
Stethoscope|doctor,listen,heart,neck,chest,lungs,ears
X-ray|bones,picture,radiation,broken,see through,scan,skeleton
Surgery|operation,cut,scalpel,doctor,theatre,anesthesia,hospital
Anesthesia|sleep,numb,operation,gas,pain,unconscious,count
Antibiotic|bacteria,infection,penicillin,pills,prescription,resistance,course
Blood pressure|cuff,arm,high,heart,measure,hypertension,squeeze
Thermometer|temperature,fever,mercury,degrees,measure,mouth,hot
Fever|temperature,hot,sick,sweat,flu,forehead,high
Diabetes|sugar,insulin,glucose,type,pancreas,needle,chronic
Concussion|head,hit,brain,dizzy,football,injury,knock
Stitches|wound,sew,cut,thread,needle,close,laughing
Crutches|leg,broken,walk,armpit,support,injury,sticks
Placebo|fake,pill,sugar,effect,trial,control,believe
Appendix|burst,remove,organ,useless,book,right side,pain
Pacemaker|heart,beat,device,implant,rhythm,chest,electric
Climate change|global warming,temperature,carbon,weather,greenhouse,planet,emissions
Greenhouse effect|gases,trap,heat,atmosphere,carbon,warming,glass
Solar panel|sun,roof,energy,electricity,renewable,photovoltaic,power
Wind turbine|blades,energy,spin,renewable,farm,electricity,mill
Compost|food waste,soil,rot,garden,worms,organic,bin
Deforestation|trees,cut,Amazon,logging,woods,clear,jungle
Carbon footprint|emissions,impact,CO2,travel,reduce,personal,flying
Pollution|dirty,smog,waste,air,toxic,factory,contaminate
Ozone layer|hole,atmosphere,UV,protect,CFCs,sun,stratosphere
Glacier|ice,melt,slow,mountain,frozen,retreat,Alps
Endangered species|extinct,rare,protect,panda,animals,threatened,list
Oil spill|tanker,ocean,black,leak,birds,disaster,slick
Landfill|garbage,dump,trash,bury,waste,rubbish,site
Drought|dry,rain,water,crops,shortage,desert,thirsty
Coral reef|ocean,bleaching,Australia,fish,barrier,colourful,underwater
Blueprint|plan,design,drawing,architect,building,paper,schematic
Gear|teeth,wheel,cog,turn,bike,shift,mesh
Circuit|electric,board,wires,current,loop,short,race
Prototype|first,model,test,early,version,design,sample
Welding|metal,join,torch,sparks,mask,heat,fuse
Crane|lift,construction,tall,heavy,hook,bird,tower
Piston|engine,cylinder,up and down,car,pump,combustion,rod
Dam|water,river,block,beaver,reservoir,hydro,Hoover
Algorithm|steps,computer,code,sort,instructions,procedure,feed
Pulley|rope,wheel,lift,weight,simple machine,hoist,block
Atom|small,nucleus,particle,electron,element,split,matter
Molecule|atoms,bond,water,compound,small,chemical,H2O
DNA|genes,helix,double,genetic,code,test,chromosome
Evolution|Darwin,species,natural selection,ape,change,adapt,survival
Photosynthesis|plants,sunlight,chlorophyll,oxygen,leaves,energy,green
Black hole|space,gravity,light,escape,star,event horizon,suck
Big Bang|universe,beginning,explosion,theory,start,expand,sitcom
Periodic table|elements,Mendeleev,chemistry,rows,symbols,chart,atomic
Electron|negative,charge,orbit,atom,particle,shell,current
Oxygen|breathe,air,gas,O2,lungs,tank,element
Hydrogen|lightest,gas,first,water,element,bomb,H
Friction|rub,resist,heat,surface,slide,force,grip
Velocity|speed,direction,fast,vector,physics,rate,metres
Hypothesis|guess,theory,test,predict,educated,experiment,idea
Experiment|test,lab,hypothesis,results,scientist,try,control
Laboratory|experiments,scientist,coat,test tubes,research,room,Dexter
Test tube|glass,lab,chemistry,rack,liquid,baby,cylinder
Fossil|bone,dinosaur,rock,ancient,dig,fuel,imprint
Bacteria|germs,microscopic,infection,single,antibiotics,gut,cells
Cell|small,body,biology,membrane,prison,phone,nucleus
Chromosome|DNA,genes,X,Y,pairs,forty-six,inherit
Protein|muscle,amino acids,meat,shake,nutrient,gym,eggs
Enzyme|catalyst,digest,biological,speed up,reaction,break down,saliva
Ecosystem|environment,organisms,balance,habitat,community,nature,web
Food chain|eat,predator,prey,top,energy,links,producer
Galaxy|stars,Milky Way,space,spiral,universe,Samsung,billions
Comet|tail,ice,space,Halley,orbit,streak,dirty snowball
Asteroid|rock,space,belt,dinosaurs,impact,meteor,collision
Eclipse|sun,moon,block,shadow,total,glasses,solar
Light year|distance,space,far,travel,Buzz,astronomy,trillion
Radiation|nuclear,rays,Chernobyl,exposure,X-ray,dangerous,glow
Einstein|relativity,genius,E=mc2,hair,physicist,Albert,tongue
Darwin|evolution,finches,Galapagos,Beagle,species,Charles,natural selection
Newton|apple,gravity,laws,Isaac,motion,physics,calculus
Marie Curie|radioactivity,Nobel,polonium,radium,Polish,woman,physicist
Entropy|disorder,thermodynamics,chaos,heat,second law,increase,randomness
Mitochondria|powerhouse,cell,energy,ATP,organelle,biology,mother
Supernova|star,explode,death,bright,space,collapse,Oasis
Tectonic plates|earthquake,continents,crust,shift,fault,drift,collide
Nucleus|centre,atom,cell,protons,core,neutrons,middle
Mona Lisa|Leonardo,smile,Louvre,portrait,da Vinci,famous,woman
Picasso|cubism,Spanish,Guernica,painter,Pablo,blue period,faces
Van Gogh|ear,Starry Night,sunflowers,Dutch,Vincent,painter,post-impressionist
Sculpture|statue,carve,marble,clay,chisel,three-dimensional,David
Graffiti|spray,wall,street,Banksy,tag,vandalism,paint
Banksy|street,anonymous,stencil,Bristol,shredded,graffiti,balloon
Abstract art|shapes,Pollock,meaning,modern,non-representational,colours,Kandinsky
Self-portrait|artist,mirror,own,face,paint,Frida,selfie
Watercolour|paint,wet,brush,paper,wash,transparent,pigment
Origami|paper,fold,Japan,crane,square,craft,crease
Mozart|composer,Austria,prodigy,Wolfgang,classical,Requiem,Salzburg
Beethoven|deaf,composer,symphony,Ludwig,Fur Elise,fifth,dog
The Beatles|Liverpool,John,Paul,fab four,Yellow Submarine,Abbey Road,Ringo
Jazz|saxophone,improvise,New Orleans,swing,blues,Miles Davis,smooth
Hip hop|rap,beats,Bronx,MC,rhyme,breakdance,culture
Choir|sing,church,voices,group,harmony,conductor,robes
Saxophone|brass,jazz,reed,blow,Lisa Simpson,Kenny G,instrument
Chorus|refrain,repeat,song,verse,hook,sing,catchy
Lullaby|baby,sleep,sing,bedtime,cradle,soft,rock-a-bye
Album|songs,record,tracks,cover,release,artist,photos
Runway|catwalk,models,walk,show,airport,designer,strut
Haute couture|Paris,designer,expensive,custom,high,handmade,French
Sneakers|shoes,trainers,Nike,laces,Jordans,rubber,collect
Hoodie|sweatshirt,hood,pocket,casual,zip,pullover,drawstring
High heels|shoes,stiletto,tall,women,walk,pointy,blisters
Thrift shop|second hand,used,cheap,vintage,charity,Macklemore,donate
Sunglasses|shades,eyes,dark,UV,Ray-Ban,summer,cool
Tuxedo|formal,black tie,suit,wedding,penguin,bow,James Bond
Vogue|magazine,Anna Wintour,cover,Madonna,style,models,glossy
Corset|waist,tight,lace up,Victorian,breathe,bodice,ribs
Artificial intelligence|machine,learning,ChatGPT,smart,robot,neural,think
Cloud computing|servers,storage,internet,AWS,remote,online,data
Blockchain|Bitcoin,ledger,crypto,decentralized,distributed,mining,hash
Bitcoin|crypto,currency,digital,Satoshi,mining,wallet,coin
Virtual reality|headset,goggles,immersive,3D,Oculus,simulated,world
Search engine|Google,find,results,query,web,Bing,look up
Social media|Facebook,Instagram,posts,followers,likes,share,network
Streaming|Netflix,watch,online,live,buffer,Twitch,Spotify
QR code|scan,square,phone,black and white,menu,barcode,camera
USB|plug,port,drive,cable,stick,three tries,connector
Touchscreen|finger,tap,swipe,phone,tablet,glass,display
Firewall|security,block,network,protect,hackers,filter,barrier
Hacker|break in,computer,hoodie,password,cyber,steal,code
Bug|error,code,insect,fix,software,glitch,crash
Spam|junk,email,unwanted,folder,canned meat,inbox,filter
Download|file,save,internet,get,transfer,install,arrow
Pixel|dot,screen,resolution,tiny,image,square,Google
3D printer|layers,plastic,print,object,filament,model,nozzle
Self-driving car|autonomous,Tesla,autopilot,sensors,no hands,robot,Waymo
Smartwatch|wrist,Apple,steps,notifications,time,fitness,wearable
France|Paris,baguette,Eiffel,wine,croissant,Europe,Macron
Italy|pasta,Rome,boot,pizza,Venice,Europe,Vespa
Spain|Madrid,paella,bullfight,flamenco,siesta,Barcelona,Iberia
Germany|Berlin,beer,sausage,Oktoberfest,Europe,cars,Merkel
Japan|Tokyo,sushi,samurai,anime,rising sun,island,Fuji
Russia|Moscow,vodka,biggest,Siberia,Putin,cold,Kremlin
United Kingdom|England,London,queen,tea,Britain,Brexit,Scotland
United States|America,fifty,Washington,stars and stripes,USA,dollar,eagle
South Korea|Seoul,K-pop,kimchi,Samsung,peninsula,BTS,Gangnam
Argentina|Messi,tango,Buenos Aires,steak,Patagonia,South America,Maradona
South Africa|Mandela,Cape Town,apartheid,safari,rainbow,Johannesburg,springbok
Greece|Athens,islands,ancient,feta,Olympus,gods,gyros
Switzerland|chocolate,Alps,neutral,watches,cheese,banks,knife
Netherlands|Amsterdam,tulips,windmills,Dutch,bikes,canals,Holland
Sweden|IKEA,Stockholm,ABBA,meatballs,Scandinavia,Volvo,Nordic
Ireland|Dublin,Guinness,leprechaun,green,shamrock,potato,emerald
Thailand|Bangkok,pad thai,elephants,beaches,temples,Phuket,Siam
Turkey|Istanbul,kebab,bird,Ankara,bazaar,Ottoman,Thanksgiving
New Zealand|kiwi,sheep,hobbit,Maori,Auckland,All Blacks,haka
Iceland|Reykjavik,volcano,geysers,Bjork,northern lights,cold,Vikings
Parliament|government,MPs,house,debate,laws,Westminster,chamber
Constitution|document,rights,law,founding,amendment,supreme,we the people
Prime minister|leader,government,head,Downing Street,parliament,elected,Trudeau
Dictator|ruler,absolute,power,tyrant,authoritarian,Hitler,regime
Lobbyist|influence,money,politicians,interests,Washington,corporate,persuade
Filibuster|delay,talk,Senate,block,long,speech,vote
Referendum|vote,question,public,yes or no,Brexit,direct,ballot
Veto|reject,block,president,power,no,bill,override
Impeachment|remove,president,trial,charges,Congress,office,Nixon
Propaganda|misleading,posters,biased,government,war,spread,brainwash
Protest|march,signs,demonstration,streets,rally,crowd,object
Coalition|parties,together,government,alliance,join,majority,share
Senator|Congress,elected,state,upper house,six years,Washington,politician
Embassy|ambassador,foreign,diplomat,visa,consulate,building,country
Campaign|election,run,candidate,slogan,ads,trail,donations
Shakespeare|playwright,Hamlet,bard,Romeo,Stratford,William,sonnets
Romeo and Juliet|lovers,Verona,balcony,tragedy,poison,families,star-crossed
Sherlock Holmes|detective,Watson,Baker Street,elementary,pipe,Conan Doyle,deduce
Dracula|vampire,Transylvania,count,blood,Bram Stoker,fangs,coffin
Frankenstein|monster,Mary Shelley,creature,doctor,bolts,lightning,alive
Moby Dick|whale,Ahab,white,Ishmael,Melville,ship,harpoon
The Great Gatsby|Fitzgerald,twenties,green light,parties,Daisy,old sport,West Egg
Pride and Prejudice|Austen,Darcy,Elizabeth,Bennet,marriage,regency,sisters
Don Quixote|windmills,Cervantes,Spain,knight,Sancho,La Mancha,delusional
The Odyssey|Homer,journey,Ithaca,cyclops,Greek,epic,Penelope
Alice in Wonderland|rabbit hole,Mad Hatter,Cheshire,queen of hearts,Carroll,tea party,drink me
Winnie the Pooh|honey,bear,Piglet,Christopher Robin,Tigger,Eeyore,hundred acre
The Little Prince|rose,fox,planet,pilot,Saint-Exupery,French,asteroid
Novel|book,fiction,long,story,chapters,author,new
Bestseller|popular,list,copies,sold,New York Times,top,hit
Bookmark|page,place,save,browser,ribbon,slip,dog-ear
Paperback|soft,cover,cheap,book,edition,flexible,hardcover
Haiku|Japan,syllables,five,seven,three lines,poem,nature
Autobiography|life,own,story,memoir,write,yourself,famous
Cliffhanger|suspense,ending,unresolved,next,episode,chapter,edge
Socrates|Athens,hemlock,questions,Plato,Greek,know nothing,method
Plato|Socrates,cave,Republic,Greek,forms,Aristotle,Academy
Nietzsche|God is dead,Ubermensch,German,moustache,Zarathustra,nihilism,will to power
Existentialism|Sartre,meaning,absurd,existence,freedom,Camus,essence
Free will|choice,determinism,decide,fate,control,agency,liberty
Ethics|morals,right,wrong,principles,conduct,philosophy,good
Stoicism|Marcus Aurelius,calm,endure,Seneca,emotions,control,Epictetus
Karma|what goes around,deeds,consequences,Hindu,rebirth,deserve,instant
Utopia|perfect,ideal,society,paradise,More,dystopia,nowhere
Trolley problem|five,one,lever,track,dilemma,switch,kill
Time travel|past,future,machine,DeLorean,paradox,back,clock
Teleportation|beam,instant,transport,Scotty,disappear,place,Star Trek
Cyborg|half,machine,human,robot,implants,Terminator,bionic
Clone|copy,identical,Dolly,duplicate,DNA,sheep,twin
Dystopia|bleak,future,1984,oppressive,society,Hunger Games,utopia
Star Trek|Enterprise,Spock,Kirk,Vulcan,boldly go,Klingon,warp
The Matrix|Neo,red pill,simulation,Keanu,Morpheus,agents,bullet
Dune|sand,spice,Arrakis,worms,Herbert,Atreides,desert
Wormhole|shortcut,space,tunnel,portal,travel,Interstellar,bridge
Lightsaber|Jedi,sword,glow,Star Wars,force,hum,laser
`.trim().split('\n').map(line => {
  const [word, banned] = line.split('|');
  return { word, banned: banned.split(',') };
});

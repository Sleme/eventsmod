// Let's define things.
let _modPath;

// Makes my life easier
const grs = GetRootScope();

// Makes debugging easier
const debug = str => Helpers.ConsoleInfo(`[MOD] In game events: ${str}`);

// States that no disputes are happening
grs.adisputeishappening = false;

// Facebook days = 0 (Don't ask)
grs.fdays = 0;


// Refresh feature, never implemented I think but might come in usefull
const refreshevents = () => {
  //Amount of money sued
  grs.amount  =  (Math.floor(Math.random() * 20) + 1)* 1000;;
  //Days left to pay
  grs.days  =  Math.floor(Math.random() * 10) + 5;
  // variable for company randomises what company sent the email
  grs.compproductsrandom  =  Math.floor(Math.random() * 10) + 0;
};


//States that Facebook hasn't been released
FacebookReleasedStarted = 0;

// Facebook days = 0 again?
fdays = 0;

// Facebook hours = 0
fhour = 0;

//****
// Lets start the mod from here, please don't judge me.
//***


// Start mod thing
exports.initialize = (modPath) =>{
    _modPath = modPath;


    // Add new menu item
    Modding.setMenuItem({
        name: 'events',
        tooltip: "Legal",
        tooltipPosition: 'top',
        faIcon: 'fa-gavel',
        badgeCount: 0,
    });




    // Define custom views
    exports.views = [
        {
          viewPath: _modPath + 'view.html',
            name: 'events',
            controller: function ($rootScope) {
                this.name = 'Jonas';
                this.tabSelect = 'firsttab';


                // Name of company having a dispute with
                grs.company  = GetRootScope().settings.competitorProducts[Math.floor(Math.random() * 10) + 0].name;

                // Option to pay now
                this.cpaynow = () =>{

                  // Take away how much the player is being sued for ;(
                  GetRootScope().settings.balance -= GetRootScope().camount;

                  // Reset the badge count to 0
                  Modding.setMenuItemBadgeCount('events', 0);

                  // State no disputes are happening
                  GetRootScope().adisputeishappening = false;

                  // Play a money gaining sound ;)
                  PlaySound(Sounds.money);
                }



                // Variable to decide if you have won the dispute
                this.cdispute =() => {

                  // Has the user wont dispute? 2 = no 1 = yes
                  var winDispute = Math.random() < 0.5 ? 1 : 2;

                  if (winDispute = 1) {
                    // Give the user how much the company was asking for compensation
                    GetRootScope().settings.balance += GetRootScope().camount;

                    // Add a notification telling the player what happened.
                    $rootScope.addNotification("Looks like you won the dispute for this mistake you get " + numeral(GetRootScope().camount).format(Configuration.CURRENCY_FORMAT) + " !", 1);

                    // Set the badge count to 0
                    Modding.setMenuItemBadgeCount('events', 0);

                    // Play a victory sound ;)
                    PlaySound(Sounds.victory);

                    // State that a dispute isn't happening anymore
                    GetRootScope().adisputeishappening = false;

                    // Play a money gaining sound ;)
                    PlaySound(Sounds.money);
                  }else {
                    // Take away the money as the player did not win the dispute
                    GetRootScope().settings.balance -= GetRootScope().camount;

                    // Add notification warning the player of what just happened
                    $rootScope.addNotification("Looks like you lost the dispute, this means you have to pay up - " + numeral(GetRootScope().camount).format(Configuration.CURRENCY_FORMAT) + " !", 1);

                    // Set the badge count to 0
                    Modding.setMenuItemBadgeCount('events', 0);

                    // Play a soft fail sound don't wanna be too harsh
                    PlaySound(Sounds.softFail);

                    // State that a dispute isnt happening anymore
                    GetRootScope().adisputeishappening = false;

                    // Play a money sound ;( bye bye
                    PlaySound(Sounds.money);
                  }
                }



                // "Copyright problem" with whatever cimpany
                this.copyright = () => {

                  // Add something in console for debug
                  debug('Copiright problem happening!');

                  // State that yes, a dispute is happening
                  GetRootScope().adisputeishappening = true;

                  // Set Copytight Amount to equal the generated value
                  grs.camount = GetRootScope().amount;

                  // Set Copytight Days to equal the generated value not implemented yet, I am lazy
                  grs.cdays = GetRootScope().days;

                  // Set Copytight Company to equal the generated value
                  grs.ccompany = GetRootScope().company;

                  // Play gasping sound :0
                  PlaySound(Sounds.gasp);

                  //Send email ;(
                  GetRootScope().sendMail(`${(GetRootScope().ccompany)}`,` Notice to ${GetRootScope().settings.companyName}.`,
                  `Dear ${GetRootScope().settings.companyName},
                  It has come to our attention that you have infringed our copyright.
                  We will be suing you for ${numeral(GetRootScope().camount).format(Configuration.CURRENCY_FORMAT)} due to this. Please reply within ${(GetRootScope().cdays)} days else you will be fined another $100 for failure to respond.`);
                  debug('Email sent, warning of copyright')


                  // Set the bade count to 1
                  Modding.setMenuItemBadgeCount('events', 1);

                  //Showing Message just incase else fails.
                  $rootScope.showMessage('Ouch!', `Looks like you have some legal dispute with tech giant ${(GetRootScope().ccompany)}!
                  They say you have infringed their copyright and they want to sue you for ${numeral(GetRootScope().camount).format(Configuration.CURRENCY_FORMAT)}!
                  Check your email!`, () => {
                    debug('Notification shown for copyright thing')
                  });
                };

                //***
                // Copyright dispute event has finished hooray!
                //***


                // Setting things up for facebook

                // Has this happened before ? 0 = no
                let happenedbefore = 0;

                // Is facebook released? 0 = no
                FacebookReleasedStarted = 0;

                // Facebook is released event
                this.FacebookReleased = () => {
                  debug('Facebook just released!');


                  // Play gasping sound
                  PlaySound(Sounds.gasp);



                  if (GetRootScope().settings.products[0].users.Web >= 1000000 || GetRootScope().settings.products[0].users.Mobile >= 1000000){
                    debug('Displaying happened before value, debug.')
                    console.log(happenedbefore);
                     if(!happenedbefore) {

                       // Happened before becomes true
                       happenedbefore += 1;
                      debug('One product surpassed 1M users, start Facebook!');

                      //Showing Message
                      $rootScope.showMessage('Jeesh!', `Looks like ${(GetRootScope().settings.competitorProducts[3].name)} just released the biggest update to Facebook yet!
                      Looks like you might have some problems! Seems like everyone is moving over to that,  you might see a drop in users for the next week :/`);
                      debug('Message shown for Facebook event!');

                      // Set Facebook released to 1 (true)
                      FacebookReleasedStarted += 1;
                      }else {
                      debug('Happened before is true, skipping event.');
                    }
                  }else {
                    debug('No products have 1M users not executing.');
                  }
                }
            }
        }
    ]
};


exports.onLoadGame = settings => {debug('Events mod loaded, all seems fine')};

exports.onNewHour = settings => {};

counter = 0;

exports.onNewDay = settings => {
/// This has all been turned off for the moment, why?
/// Because it cause problems, this is supposed to be the backend of how each event is triggered but right now its a mess.


//grs.contractHappen = Math.random() >= 0.1;

//if (GetRootScope().settings.products[0].users.Web >= 1000000 || GetRootScope().settings.products[0].users.Mobile >= 1000000){
//  this.FacebookReleased;
//  debug('Tried to activate event FB')
//}

//  if (FacebookReleasedStarted == 1) {
//    if(counter < 7){
//     GetRootScope().settings.products[0].users.Web -= 1000;
//     GetRootScope().settings.products[0].users.Mobile -= 1000;
//     GetRootScope().addNotification(`You lost 2000 users on ${(GetRootScope().settings.products[0].name)} due to ${(GetRootScope().settings.competitorProducts[3].name)}'s update!`,1);
//     GetRootScope().settings.products[0].hype -= 30;
//     GetRootScope().addNotification(`You lost 30% hype on ${(GetRootScope().settings.products[0].name)} due to ${(GetRootScope().settings.competitorProducts[3].name)}'s update!`,1);

//     debug('Lost 1000 users');
//      debug('happened for a day');
//      counter++;
//          debug('Counter updated');
//          FacebookReleasedStarted += 0;
//          debug('FacebookReleasedStarted set to 0');
//     } else {
//       done();
//     }
//  }else {
//    debug('Facebook not released, skipping.');
//  }
//    if (GetRootScope().contractHappen == false) {
//      this.copyright;
//      debug('Tried to activate event Copyright');
// }
};

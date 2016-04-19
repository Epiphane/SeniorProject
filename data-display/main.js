var Test = React.createClass({
   // mixins: [ParseReact.Mixin], // Enable query subscriptions

   // observe: function() {
   //    // Subscribe to all Comment objects, ordered by creation date
   //    // The results will be available at this.data.comments
   //    return {
   //       events: (new Parse.Query('Event')).equalTo('eventType', 'combat').equalTo('user_placeholder', localStorage.user_id).ascending('createdAt')
   //    };
   // },

   componentDidMount: function() {
      // setInterval(this.refreshQueries.bind(this), 1000);
   },

   render: function() {
   return (
            <div style={{width: "512px"}}>
               <canvas id="myChart" width="400" height="400"></canvas>

               {/* <h1>So far, you've <span style={{color: "red"}}>MURDERED:</span></h1>

                {this.data.events.map(function (event, ndx) {
                   var img_name = event.value.split(".")[0];
                   var extension = event.value.split(".")[1];

                   return (
                      <img src={"../assets/images/" + img_name + "-rip." + extension} />
                   )
                })} */}
            </div>
         )
 }
});

React.render(<Test />,
             document.getElementById('react-container'));


function MyViewModel(){

    var self = this;
    this.map;
    this.availableLocations = ko.observableArray(locationData);
    this.locationData = locationData;
    this.filteredLocation = locationData;
    this.filterText = ko.observable("");


    this.renderMakers = function(map){
        self.map = map;//initialize the map object

        self.locationData.forEach(function(location) {

        var marker = new google.maps.Marker({ position: location, map: map, title: location.name});

        marker.addListener('click',function(){

            if(marker.getAnimation() == null){
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function(){
                    marker.setAnimation(null);
                },400)
                }
                else{
                    marker.setAnimation(null);
                }
                self.getInfoWindowData(marker);
            })
            location.marker = marker;
        })


    }

    this.getInfoWindowData = function(marker){

        var newLat = marker.getPosition().lat();
        var newLng = marker.getPosition().lng();
        //console.log(newLat+ " : " + newLng);
        const client_id= "LTWB1MMND0OO3Q3KSL5FUUMNT3DYSD3Y1NUT1JV1BAIKX2WW";
        const client_secret= "LOVVNUNHCPSZYKS50OSVK4CESWR5RSWX23QL3CNRXCLJPHAM";
        const v = "20170801";

        var api = "https://api.foursquare.com/v2/venues/search?ll="+newLat+","+newLng+"&client_id="+client_id+"&client_secret="+client_secret+"&v="+v+"&limit=1";


        $.ajax({
            url: api,
            method: 'GET',
            dataType: 'json',
            success: function(dt){
                var name = dt.response.venues[0].name;
                var address = dt.response.venues[0].location.formattedAddress.join(", ");
                var content = "<h4>"+ name + "</h4><br><p>"+ address + "</p>";

                var infowindow = new google.maps.InfoWindow({
                    content: content
                });

                infowindow.open(self.map, marker);
            },
            error: function() {
                alert('An error occurred');
            }
        });


    }

    this.onLocationClicked = function(location){
        google.maps.event.trigger(location.marker, "click");
    }

    this.onFilter = function(){ //filter function for button an search field

        //alert("test");

        if(!self.filterText()){

            self.filteredLocation = locationData;
            self.availableLocations(self.filteredPlaces);
            self.renderMakers(self.map);
            return null;

        }


        self.filteredLocation = locationData.filter( function(location){
            return location.name.toLowerCase().indexOf(self.filterText().toLowerCase()) !== -1
        });

        self.availableLocations(self.filteredLocation);
        self.renderMakers(self.map);
    }


}

var viewModel = new MyViewModel();
ko.applyBindings(viewModel)

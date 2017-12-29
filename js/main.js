var locationData = [
    {
        name:"Lagos Airport Hotel Ikeja", lat:6.6102296, lng:3.3437677, marker : null
    },
    {
        name:"National Stadium Lagos", lat:6.4971913, lng:3.3625254, marker : null
    },
    {
        name:"Art Museum", lat:6.4238367, lng:3.4445571, marker : null
    },
    {
        name:"Lekki Leisure Lake", lat:6.423789, lng:3.459878, marker : null
    },
    {
        name:"Eko Hotels", lat:6.4265583, lng:3.4277773, marker:null
    }
]

function myViewModel(){

    var self = this;
    this.map;
    this.locationData = locationData;


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
            }
        })


    }


}

var viewModel = new myViewModel();
ko.applyBindings(viewModel)

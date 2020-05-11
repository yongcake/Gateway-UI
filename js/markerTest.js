var markers = [];
var marker_counter = 0;

function get_click_position(ev) {
    var dist_top = $(document).scrollTop();
    var dist_left =$(document).scrollLeft();
    var x = ev.clientX + dist_left;
    var y = ev.clientY + dist_top;
    return [x,y];
}

function remove_marker(ev) {
    var coord = get_click_position(ev);
    for(var i = 0; i < markers.length; i++) {
        var m = markers[i];
        if(coord[0] >= m[1] && coord[1] >= m[2] && coord[0] <= m[3] && coord[1] <= m[4]) {
            $('#marker' + m[0]).remove();
            delete markers[i];
            markers = markers.filter(x => x !== undefined);
            break;
        }
    }
    console.log(markers);
    return false;
}

$(document).ready(function (){
    $('.floorPlanZoneContainer').bind('click', function (ev) {
        var $img = $(ev.target);
        var coord = get_click_position(ev);
        
        var new_marker = $("<img src='Image/marker.png' id='marker"+marker_counter+"' class='marker' oncontextmenu='return false;'/>");
        new_marker.css({position: 'absolute', left: coord[0]-25, top: coord[1]-25});
        $('.imageContainer').append(new_marker);
        $('#marker'+marker_counter).bind('contextmenu', function (ev) {remove_marker(ev); });
        markers.push([marker_counter, coord[0]-25, coord[1]-25, coord[0]+25, coord[1]+25]);
        marker_counter++;
    });
});
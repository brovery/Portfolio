/**
 * Created by brandon_overy on 8/31/15.
 */

function contactMeHandler() {
    var form = document.getElementById('contactForm');

    for (var i = 0; i < form.length; i++) {
        console.log(form[i].value);
    }
}
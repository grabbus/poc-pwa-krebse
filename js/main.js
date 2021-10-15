window.onload = () => {
    'use strict';
  
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceworker.js').then(function(reg) {
          // Registrierung erfolgreich
          console.log('Registrierung erfolgreich. Scope ist ' + reg.scope);
        }).catch(function(error) {
          // Registrierung fehlgeschlagen
          console.log('Registrierung fehlgeschlagen mit ' + error);
        });
      };
  }

function submit(event)
{  
    event.preventDefault()
    console.log('submitted', event);
    let data = {
        name: document.getElementById('name'),
        crustacean_1: document.getElementById('crustacean_1').value,
        crustacean_2: document.getElementById('crustacean_2').value,
        crustacean_3: document.getElementById('crustacean_3').value,
        crustacean_4: document.getElementById('crustacean_4').value,
        number_fish_traps: document.getElementById('number_fish_traps').value,
        comment: document.getElementById('comment').value,
        user_id: document.getElementById('user_id').value,
        section_id: document.getElementById('section_id').value,
      };

      console.log(data);
}

  async function submitPostData(data) {
    // Default options are marked with *
    const response = await fetch('https://backend.michaelgrabinger.com/api/fangs', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  }
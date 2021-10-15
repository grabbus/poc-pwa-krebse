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

      if(checkOnlineStatus) {
          let db;
          let request = window.indexedDB.open('fangportal', 1);
          request.onerror = function(event) {
            console.error("Database error: " + event.target.errorCode);
          }
          request.onsuccess = function(event) {
              db = event.target.result;
          }
      }
  }

function checkOnlineStatus()
{
    if (navigator.onLine) {
        return true;
    } else if (navigator.offline) {
        return false;
    }
}

function submit()
{  
    let data = {
        name: document.getElementById('name').value,
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
  
      // if app is offline save the data in the indexedDB
      if(checkOnlineStatus === false) {
        request.onupgradeneeded = function (event) {
            let db = event.target.result;

            let objectStore = db.createObjectStore('post-requests');
            objectStore.transaction.oncomplete = function(event) {
                let postRequestObjectStore = db.transaction('post-requests', 'read-write').objectStore('post-requests');
                postRequestObjectStore.add(data);
            }
        }
      }


     
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
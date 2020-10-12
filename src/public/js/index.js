function showLoginForm() {
  const form = document.querySelector('.loginform');
  if(form.style.display == 'none') {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}

function showCreateForm() {
  const form = document.querySelector('.createaccountform');
  if(form.style.display == 'none') {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}
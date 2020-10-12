function showForm() {
  const form = document.querySelector('.loginform');
  if(form.style.visibility == 'hidden') {
    form.style.visibility = "visible";
  } else {
    form.style.visibility = "hidden";
  }
}

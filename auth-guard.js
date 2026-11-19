
(async function () {
  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error || !session) {
    window.location.replace("./auth.html");
    return;
  }

  window.currentUser = session.user;
})();

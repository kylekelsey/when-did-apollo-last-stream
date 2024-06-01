window.onload = async function () {
  //Get Last Stream Time
  const response = await fetch(`/api`);
  const json = await response.json();
  const isLive = json.isLive;
  const lastStream = new Date(json.lastStream);

  var x = setInterval(function () {
    // Calculate time since last stream
    const timeSinceLastStream = Date.now() - lastStream;

    var days = Math.floor(timeSinceLastStream / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (timeSinceLastStream % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor(
      (timeSinceLastStream % (1000 * 60 * 60)) / (1000 * 60)
    );
    var seconds = Math.floor((timeSinceLastStream % (1000 * 60)) / 1000);

    if (isLive) {
      document.getElementById("smug").style.display = "none";
      document.getElementById("pog").style.display = "block";
      document.getElementById("main").innerHTML = "HE IS STREAMING! GO WATCH";
    } else {
      document.getElementById("smug").style.display = "block";
      document.getElementById("pog").style.display = "none";
      document.getElementById(
        "main"
      ).innerHTML = `It has been ${days} days ${hours} hours ${minutes} minutes and ${seconds} seconds since Apollo's last stream`;
    }
    // Update page
  }, 1000);
};

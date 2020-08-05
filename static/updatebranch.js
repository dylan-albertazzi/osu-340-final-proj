function updateBranch(id) {
  $.ajax({
    url: "/branches/" + id,
    type: "PUT",
    data: $("#update-branches").serialize(),
    success: function (result) {
      window.location.replace("./");
    },
  });
}

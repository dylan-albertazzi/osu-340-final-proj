function deleteBranch(id) {
  $.ajax({
    url: "/branches/" + id,
    type: "DELETE",
    success: function (result) {
      window.location.reload(true);
    },
  });
}

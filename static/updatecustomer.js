function updateCustomer(id) {
  $.ajax({
    url: "/customers/" + id,
    type: "PUT",
    data: $("#update-customers").serialize(),
    success: function (result) {
      window.location.replace("./");
    },
  });
}

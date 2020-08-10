function updateOrder(id) {
  $.ajax({
    url: "/orders/" + id,
    type: "PUT",
    data: $("#update-orders").serialize(),
    success: function (result) {
      window.location.replace("./");
    },
  });
}
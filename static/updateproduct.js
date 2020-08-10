function updateProduct(id) {
  $.ajax({
    url: "/products/" + id,
    type: "PUT",
    data: $("#update-products").serialize(),
    success: function (result) {
      window.location.replace("./");
    },
  });
}
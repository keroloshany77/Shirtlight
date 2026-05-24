import { assetPath } from "@/lib/assetPath";

export const products = [
  {
    id: "shirtnight-striped-boxy-fit",
    name: "SHIRTNIGHT STRIPED BOXY FIT",
    description: "YELLOW SHIRT",
    price: 800,
    imageUrl: assetPath("/Images/Products/Uploads/1779406483150-479859292-img-9990.png"),
    gallery: [
      assetPath("/Images/Products/Uploads/1779406483150-479859292-img-9990.png"),
      assetPath("/Images/Products/Uploads/1779406483165-209459303-img-9987.png"),
      assetPath("/Images/Products/Uploads/1779406483176-178820894-img-9988.png")
    ],
    sizeChartUrl: assetPath("/Images/Products/Uploads/1779406483189-824448561-img-9258.jpeg"),
    colors: ["Olive", "Blue", "Red"],
    sizes: ["M", "L", "XL", "XXL"],
    ctaLabel: "Shop Now"
  },
  {
    id: "shirtnight-boxy-fit-shirt",
    name: "ShirtNight Boxy Fit Shirt",
    description: "Jaberdine Cotton Boxy Fit Shirt With Embroidery",
    price: 850,
    imageUrl: assetPath("/Images/Products/Uploads/1777931524386-632650972-img-9251.jpeg"),
    gallery: [
      assetPath("/Images/Products/Uploads/1777931524386-632650972-img-9251.jpeg"),
      assetPath("/Images/Products/Uploads/1777931524387-457352787-img-9253.jpeg"),
      assetPath("/Images/Products/Uploads/1777931524388-120277618-img-9254.jpeg"),
      assetPath("/Images/Products/Uploads/1777931524388-254650732-img-9255.jpeg"),
      assetPath("/Images/Products/Uploads/1777931524391-609249802-img-9256.jpeg"),
      assetPath("/Images/Products/Uploads/1777931524392-780070319-img-9257.jpeg")
    ],
    sizeChartUrl: assetPath("/Images/Products/Uploads/1777931524393-229100871-img-9252.jpeg"),
    colors: ["Beige"],
    sizes: ["M", "L", "XL", "XXL"],
    ctaLabel: "Shop Now"
  },
  {
    id: "shirt-night-boxy-fit-shirt-checkered",
    name: "SHIRT NIGHT BOXY FIT SHIRT CHECKERED",
    description: "Material Cotton With Embroidery",
    price: 800,
    imageUrl: assetPath("/Images/Products/Uploads/1777929886402-553831479-img-9259.jpeg"),
    gallery: [
      assetPath("/Images/Products/Uploads/1777929886402-553831479-img-9259.jpeg"),
      assetPath("/Images/Products/Uploads/1777929886403-920602864-img-9262.jpeg"),
      assetPath("/Images/Products/Uploads/1777929886405-883327784-img-9261.jpeg"),
      assetPath("/Images/Products/Uploads/1777929886406-471774392-img-9260.jpeg")
    ],
    sizeChartUrl: assetPath("/Images/Products/Uploads/1777929886408-806056897-img-9258.jpeg"),
    colors: ["Blue", "Red"],
    sizes: ["M", "L", "XL", "XXL"],
    ctaLabel: "Shop Now"
  },
  {
    id: "tank-top",
    name: "Tank Top",
    description: "Shirtnight tank top, derby cotton",
    price: 300,
    imageUrl: assetPath("/Images/Products/Uploads/1777929707055-457651554-img-9263.jpeg"),
    gallery: [
      assetPath("/Images/Products/Uploads/1777929707055-457651554-img-9263.jpeg"),
      assetPath("/Images/Products/Uploads/1777929707056-906408101-img-9264.jpeg")
    ],
    sizeChartUrl: "",
    colors: ["Black", "White"],
    sizes: ["M", "XL"],
    ctaLabel: "Shop Now"
  }
];

export function getProductById(id) {
  return products.find((product) => product.id === id) || null;
}

export function formatPrice(value) {
  return `LE ${Number(value).toFixed(2)} EGP`;
}

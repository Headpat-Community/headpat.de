"use client";
import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import Header from "@/components/header";
import Footer from "@/components/footer";

const product = {
  name: "Basic Tee",
  price: "€50000",
  sizes: [
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: false },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "2XL", inStock: true },
  ],
  images: [
    {
      id: 1,
      imageSrc: "/images/404.webp",
      imageAlt: "Back of women's Basic Tee in black.",
      primary: true,
    }
  ],

  description: `
    <p>The Basic tee is an honest new take on a classic. The tee uses super soft, pre-shrunk cotton for true comfort and a dependable fit. They are hand cut and sewn locally, with a special dye technique that gives each tee it's own look.</p>
    <p>Looking to stock your closet? The Basic tee also comes in a 3-pack or 5-pack at a bundle discount.</p>
  `,
  details: [
    "Only the best materials",
    "Ethically and locally made",
    "Pre-washed and pre-shrunk",
    "Machine wash cold with similar colors",
  ],
};
const policies = [
  {
    name: "Limited Delivery",
    icon: GlobeAmericasIcon,
    description: "Germany, Austria, Switzerland",
  },
  {
    name: "Special Delivery",
    icon: CurrencyDollarIcon,
    description: "Get the badge delivered at the next Eurofurence",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const runtime = 'edge';

export default function Example() {
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <>
      <Header />
      <div className="">
        <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            {/* Image gallery */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                {product.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.imageSrc}
                    alt={image.imageAlt}
                    className={classNames(
                      image.primary
                        ? "lg:col-span-2 lg:row-span-2"
                        : "hidden lg:block",
                      "rounded-lg"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-4 border rounded">
              <div className="lg:col-span-5 lg:col-start-8 border-b pb-4">
                <div className="flex justify-between">
                  <h1 className="text-xl font-medium text-white">
                    {product.name}
                  </h1>
                  <p className="text-xl font-medium text-white">
                    {product.price}
                  </p>
                </div>
              </div>

              {/* Product details */}
              <div className="mt-6">
                <h2 className="text-sm font-medium text-white">Description</h2>

                <div
                  className="prose prose-sm mt-4 text-gray-500"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              <div className="mt-6 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-medium text-white">
                  Additional information
                </h2>

                <div className="prose prose-sm mt-4 text-gray-500">
                  <ul role="list">
                    {product.details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <form className="">
                {/* Size picker */}
                {product.sizes ? (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-medium text-white">Size</h2>
                      <a
                        href="#"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        See sizing chart
                      </a>
                    </div>

                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-2"
                    >
                      <RadioGroup.Label className="sr-only">
                        Choose a size
                      </RadioGroup.Label>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {product.sizes
                          .filter((size) => size.inStock) // Only show sizes that are in stock
                          .map((size) => (
                            <RadioGroup.Option
                              key={size.name}
                              value={size}
                              className={({ active, checked }) =>
                                classNames(
                                  "cursor-pointer focus:outline-none",
                                  active
                                    ? "ring-2 ring-indigo-500 ring-offset-2"
                                    : "",
                                  checked
                                    ? "border-transparent bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                                  "flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1"
                                )
                              }
                            >
                              <RadioGroup.Label as="span">
                                {size.name}
                              </RadioGroup.Label>
                            </RadioGroup.Option>
                          ))}
                      </div>
                    </RadioGroup>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to cart
                </button>
              </form>

              {/* Policies */}
              <section aria-labelledby="policies-heading" className="mt-10">
                <h2 id="policies-heading" className="sr-only">
                  Our Policies
                </h2>

                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {policies.map((policy) => (
                    <div
                      key={policy.name}
                      className="rounded-lg border border-gray-200 p-6 text-center"
                    >
                      <dt>
                        <policy.icon
                          className="mx-auto h-6 w-6 flex-shrink-0 text-white"
                          aria-hidden="true"
                        />
                        <span className="mt-4 text-sm font-medium text-white">
                          {policy.name}
                        </span>
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500">
                        {policy.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

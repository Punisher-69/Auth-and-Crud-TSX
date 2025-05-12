import { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  Button,
  Input,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/react";
import { RiShoppingCartLine } from "react-icons/ri";
import { useNavigate } from "react-router";

import ConfirmationModal from "./ConfirmationModal";

import { getLocalStorageParsed, useApiStore } from "../store/useProductStore";
interface Product {
  id: number | null;
  title: string;
  description: string;
  image?: string;
  price?: string;
}

const ITEMS_PER_PAGE = 4;

function Products() {
  const token = getLocalStorageParsed("access_token") as string | null;
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [newData, setNewData] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
  });
  const [updateData, setUpdateData] = useState<Partial<Product>>({});

  const productStore = useApiStore();
  const { getData, items, handleDelete, addData, editData } = productStore;

  const email = getLocalStorageParsed("email") as string | null;
  const user = getLocalStorageParsed("name") as string | null;

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getData();
    }
  }, [token, navigate, getData]);

  useEffect(() => {
    if (updateData.id) {
      setNewData({
        title: updateData.title || "",
        description: updateData.description || "",
      });
    }
  }, [updateData]);

  const isEdit = !!updateData.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEdit && updateData.id != null) {
      const res = await editData(updateData.id, newData);
      if (res.status === 200) {
        setNewData({ title: "", description: "" });
        setUpdateData({});
      }
    } else {
      const res = await addData(newData);
      if (res.status === 200) {
        setNewData({ title: "", description: "" });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("total");
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  localStorage.setItem("total", JSON.stringify(items.length));
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const currentData = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (totalPages < page) {
    setPage(page - 1);
  }

  return (
    <div className="w-full">
      <Navbar className="flex justify-around">
        <NavbarBrand>
          <p className="font-bold text-inherit flex">
            <RiShoppingCartLine className="mt-1 mr-2" />
            Shopping
          </p>
        </NavbarBrand>
        <NavbarContent className="ml-[110%]">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                size="sm"
                isBordered
                as="button"
                src="https://w7.pngwing.com/pngs/184/113/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette.png"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user}</p>
              </DropdownItem>
              <DropdownItem key="settings" description={email}>
                Email
              </DropdownItem>
              <DropdownItem
                key="logout"
                variant="shadow"
                color="danger"
                onPress={handleLogOut}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <div className="bg-blue-400 flex flex-row">
        <div className="h-[1438px] w-[250px] fixed bg-blue-900">
          <Button
            color="primary"
            radius="none"
            fullWidth
            onPress={handleDashboard}
          >
            DashBoard
          </Button>
          <Button color="primary" radius="none" fullWidth>
            Products
          </Button>
        </div>

        <div className="flex flex-wrap h-[1340px] w-full items-center justify-center">
          <form className="my-[50px]" onSubmit={handleSubmit}>
            <div className="flex">
              <Input
                className="w-[350px] mr-4"
                label="Title"
                type="text"
                value={newData.title}
                name="title"
                onChange={handleInputChange}
                isRequired
              />
              <Input
                className="w-[350px] mr-4"
                label="Description"
                type="text"
                name="description"
                value={newData.description}
                onChange={handleInputChange}
                isRequired
              />
              <Button
                className="h-[4em]"
                color="primary"
                variant="shadow"
                type="submit"
              >
                {isEdit ? "Edit" : "Add"}
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-2">
            {currentData.map((product) => (
              <div key={product.id}>
                <Card className="w-[550px] h-[550px] mb-4 mr-4">
                  <CardBody>
                    <p>Id: {product.id}</p>
                    <p>Title: {product.title}</p>
                    <img src={product.image} alt="Product" width={150} />
                    <p>Price: ${product.price}</p>
                    <p>Description: {product.description}</p>
                    <div className="mt-3 flex">
                      <Button
                        color="success"
                        variant="shadow"
                        className="mr-4"
                        onPress={() => setUpdateData(product)}
                      >
                        Edit
                      </Button>
                      <ConfirmationModal
                        deleteProduct={() => handleDelete(product.id ?? 0)}
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}

            {items.length > 0 && totalPages > 1 && (
              <div className="pl-[380px]">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={setPage}
                  showControls
                  color="primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;

import { useEffect, useState } from "react";
import {
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Card,
  Button,
  CardHeader,
} from "@heroui/react";
import { RiShoppingCartLine } from "react-icons/ri";

import axios from "axios";
import { getLocalStorageParsed } from "../store/useProductStore";
import { useNavigate } from "react-router";

function DashBoard() {
  const Products_Url: string = import.meta.env.VITE_PRODUCTS_URL;
  const navigate = useNavigate();
  const token: string | null = getLocalStorageParsed("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);
  const email: string | null = getLocalStorageParsed("email");
  const user: string | null = getLocalStorageParsed("name");
  const TotalProducts: string | null = getLocalStorageParsed("total");
  const [total, setTotal] = useState<number>(0);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("total");

    navigate("/");
  };

  axios
    .get(`${Products_Url}/products?limit=20`)
    .then((res) => {
      setTotal(res.data.length);
    })
    .catch((err) => {
      console.error(err);
    });

  const handleProducts = () => {
    navigate("/products");
  };

  return (
    <>
      <div className=" bg-blue-400 ">
        <Navbar className="flex justify-around">
          <NavbarBrand>
            <p className="font-bold text-inherit flex">
              <RiShoppingCartLine className=" mt-1 mr-2" />
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
                  className="transition-transform"
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
        <div className="bg-blue-900  w-[250px] h-lvh fixed ">
          <div className="">
            <Button color="primary" radius="none" fullWidth={true}>
              DashBoard
            </Button>
            <Button
              color="primary"
              radius="none"
              fullWidth={true}
              onPress={handleProducts}
            >
              Products
            </Button>
          </div>
        </div>
        <div className="ml-[350px] h-[849px] w-[250px] ">
          <Card className="p-4 mt-8 ">
            <CardHeader>
              <p className="text-sm  font-bold">Total Products:</p>
              <small className="text-default-500">
                &nbsp;{TotalProducts ? TotalProducts : total}
              </small>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}

export default DashBoard;

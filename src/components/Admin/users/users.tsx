import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import "../mypage.css";
import { useEffect, useState } from "react";
import UsersTable from "./usersTable";
import { FMProfile } from "../../../interfaces";
import { getAllUsers } from "../../../service/user.service";
import FmDialog from "../../../utils/dialog";

const AdminUsersComponent = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<FMProfile[]>([]);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  const fetchUsers = async () => {
    const usersData: FMProfile[] = await getAllUsers();
    setUsers(usersData);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [deleteBookingDialogOpen, setDeleteBookingDialogOpen] =
    useState<boolean>(false);
  const handleCloseDeleteDialog = () => setDeleteBookingDialogOpen(false);

  return (
    <>
      <Box id="my-page-header">{t("User Management")}</Box>
      {/* <Divider /> */}
      <Box id="my-page-wrapper">
        <UsersTable users={users} isMobile={isMobile} fetchUsers={fetchUsers} />
      </Box>
      <FmDialog
        onDialogOpen={deleteBookingDialogOpen}
        onDialogClose={handleCloseDeleteDialog}
        onHandleAction={() => {}}
        props={{
          title: t("Delete booking"),
          description: t("Are you sure you want to delete booking?"),
          action: t("Delete"),
        }}
      />
    </>
  );
};

export default AdminUsersComponent;

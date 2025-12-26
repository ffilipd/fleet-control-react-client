import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface FMDialogProps {
  onDialogOpen: boolean;
  onDialogClose: () => void;
  onHandleAction: () => void;
  props: {
    title: string;
    description: string;
    action: string;
  };
}

const FmDialog: React.FC<FMDialogProps> = ({
  onDialogOpen,
  onDialogClose,
  onHandleAction,
  props,
}) => {
  const { title, description, action } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      open={onDialogOpen}
      onClose={onDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t(title)}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t(description)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogClose} autoFocus>
          {t("Cancel")}
        </Button>
        <Button onClick={onHandleAction}>{action}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FmDialog;

import React from "react";

import { useTranslation } from "react-i18next";

import { useNotifications } from "@hooks/NotificationsContext";
import { deleteUserTOTPConfiguration } from "@services/UserInfoTOTPConfiguration";
import DeleteDialog from "@views/Settings/TwoFactorAuthentication/DeleteDialog";

interface Props {
    open: boolean;
    handleClose: () => void;
}

const OneTimePasswordDeleteDialog = function (props: Props) {
    const { t: translate } = useTranslation("settings");
    const { createSuccessNotification, createErrorNotification } = useNotifications();

    const handleCancel = () => {
        props.handleClose();
    };

    const handleRemove = async () => {
        const response = await deleteUserTOTPConfiguration();

        if (response.data.status === "KO") {
            if (response.data.elevation) {
                createErrorNotification(translate("You must be elevated to delete a One-Time Password"));
            } else if (response.data.authentication) {
                createErrorNotification(
                    translate("You must have a higher authentication level to delete a One-Time Password"),
                );
            } else {
                createErrorNotification(translate("There was a problem deleting the One-Time Password"));
            }

            return;
        }

        createSuccessNotification(translate("Successfully deleted the ne-Time Password"));

        props.handleClose();
    };

    const handleClose = (ok: boolean) => {
        if (ok) {
            handleRemove().catch(console.error);
        } else {
            handleCancel();
        }
    };

    return (
        <DeleteDialog
            open={props.open}
            handleClose={handleClose}
            title={translate("Remove One-Time Password")}
            text={translate("Are you sure you want to remove the One-Time Password from your account")}
        />
    );
};

export default OneTimePasswordDeleteDialog;

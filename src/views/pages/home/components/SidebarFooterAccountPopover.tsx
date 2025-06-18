import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { ListItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {
  AccountPopoverFooter,
  SignOutButton,
} from '@toolpad/core/Account'
import SettingsIcon from '@mui/icons-material/Settings';

const selects = [
  {
    key: 2,
    primary: 'Thiết lập tài khoản',
    Icon: <SettingsIcon />
  },
];

export function SidebarFooterAccountPopover() {

  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}></Typography>
      <MenuList>
        {selects.map((select) => (
          <MenuItem
            key={select.key}
            // onClick={() => handleClick(select.key)}
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              columnGap: 2,
            }}
          >
            <ListItem>{select.Icon}</ListItem>
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={select.primary}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

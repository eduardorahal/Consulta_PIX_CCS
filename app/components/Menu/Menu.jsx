'use client'

import * as React from 'react';
import { mainListItems, secondaryListItems } from './ItensMenu';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MenuContext, MenuProvider } from './menuContext';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const { state, dispatch } = React.useContext(MenuContext)
  const [open, setOpen] = React.useState(state.open)

  const theme = useTheme();

  const handleDrawerOpen = () => {
    dispatch({ type: 'setMenu', payload: true })
    setOpen(true)
  };

  const handleDrawerClose = () => {
    dispatch({ type: 'setMenu', payload: false })
    setOpen(false)
  };

  return (
    <>
      <Drawer variant="permanent" open={open} >
        <DrawerHeader>
          {!open ? <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => handleDrawerOpen()}
              edge="start"
              sx={{
                ...(open && { display: 'none' }),
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </> : <>
            <IconButton onClick={() => handleDrawerClose()}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </>}
        </DrawerHeader>
        {open ?
          <img src='Logo_Lab.jpg' style={{ alignSelf:'center', margin:'10px' }} width='100%' /> :
          <img src='logo_Lab_sm.png' style={{ alignSelf:'center', margin:'10px' }} width={40} />
        }
        <Divider />
        <List>{mainListItems}</List>
        <List style={{ marginTop: 'auto' }}>{secondaryListItems}</List>
      </Drawer>
    </>
  );
}
'use client'

import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import LogoutIcon from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import Link from 'next/link';
import { Context } from '@/app/context';

export const MainListItems = () => {

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  }

  return (
    <div>
      <ListItem button component={Link} href="/"
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Visão Geral" />
      </ListItem>
      <ListItem button component={Link} href="/pix"
        selected={selectedIndex === 1}
        onClick={(event) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="PIX" />
      </ListItem>
      <ListItem button component={Link} href="/ccs"
        selected={selectedIndex === 2}
        onClick={(event) => handleListItemClick(event, 2)}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="CCS" />
      </ListItem>
    </div >
  )
};


export const SecondaryListItems = () => {
  const { state } = React.useContext(Context)

  return (
    <div>
      {
        state.admin && (
          <>
            <ListItem button component={Link} href="/user">
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Usuários" />
            </ListItem>
          </>
        )
      }
      <ListItem button component={Link} href="/auth/logout">
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Sair" />
      </ListItem>
    </div>
  );
} 
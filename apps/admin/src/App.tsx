import React from 'react';
import {
  Admin,
  Resource,
  Layout,
  AppBar,
  Title,
  UserMenu,
  MenuItemLink,
  useTheme,
  useThemeMode,
  ToggleThemeButton,
} from 'react-admin';
import { ThemeProvider, CssBaseline, Box, IconButton, Tooltip } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Tour as TourIcon,
  Category as CategoryIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { createAppTheme, useThemeMode as useCustomThemeMode } from './theme';
import dataProvider from './dataProvider';
import authProvider from './authProvider';
import Login from './components/Login';
import HeroBackgroundManager from './components/HeroBackgroundManager';

// Import resources
import TourList from './resources/TourList';
import TourEdit from './resources/TourEdit';
import TourCreate from './resources/TourCreate';
import TourShow from './resources/TourShow';

// Custom Layout
const CustomLayout = (props: any) => (
  <Layout
    {...props}
    appBar={CustomAppBar}
    menu={CustomMenu}
  />
);

// Custom AppBar with theme toggle
const CustomAppBar = (props: any) => {
  const { mode, toggleMode } = useCustomThemeMode();
  
  return (
    <AppBar {...props} userMenu={<CustomUserMenu />}>
      <Title title={env.VITE_ADMIN_TITLE} />
      <Box sx={{ flexGrow: 1 }} />
      <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
        <IconButton onClick={toggleMode} color="inherit">
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
    </AppBar>
  );
};

// Custom User Menu
const CustomUserMenu = (props: any) => (
  <UserMenu {...props}>
    <MenuItemLink to="/profile" primaryText="Profile" leftIcon={<SettingsIcon />} />
  </UserMenu>
);

// Custom Menu
const CustomMenu = (props: any) => (
  <Box>
    <MenuItemLink to="/" primaryText="Dashboard" leftIcon={<DashboardIcon />} />
    <MenuItemLink to="/tours" primaryText="Tours" leftIcon={<TourIcon />} />
    <MenuItemLink to="/categories" primaryText="Categories" leftIcon={<CategoryIcon />} />
    <MenuItemLink to="/hero" primaryText="Hero Backgrounds" leftIcon={<ImageIcon />} />
  </Box>
);

// Dashboard component
const Dashboard = () => (
  <Box p={3}>
    <Typography variant="h4" gutterBottom>
      Welcome to {env.VITE_ADMIN_TITLE}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Manage your tours, categories, and hero backgrounds from this dashboard.
    </Typography>
  </Box>
);

// Hero Backgrounds Page
const HeroBackgroundsPage = () => (
  <Box p={3}>
    <HeroBackgroundManager />
  </Box>
);

const App: React.FC = () => {
  const { mode } = useCustomThemeMode();
  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={Login}
        layout={CustomLayout}
        theme={theme}
        dashboard={Dashboard}
      >
        <Resource
          name="tours"
          list={TourList}
          edit={TourEdit}
          create={TourCreate}
          show={TourShow}
          icon={TourIcon}
        />
        <Resource
          name="categories"
          list={() => <div>Categories List</div>}
          edit={() => <div>Categories Edit</div>}
          create={() => <div>Categories Create</div>}
          show={() => <div>Categories Show</div>}
          icon={CategoryIcon}
        />
        <Resource
          name="hero"
          list={HeroBackgroundsPage}
          icon={ImageIcon}
        />
      </Admin>
    </ThemeProvider>
  );
};

export default App;


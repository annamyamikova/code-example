import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { observer } from 'mobx-react-lite';
import { useFormik } from 'formik';

import { Button, Grid, Paper, TextField, Typography } from '@mui/material';

// Components
import Loading from 'components/Loading';

// Stores
import authStore from 'stores/authStore';

import classes from './Login.module.scss';

const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isChecking } = authStore;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ email, password }, actions) => {
      if (!email?.length || !password?.length) {
        return;
      }

      authStore.login(email, password).finally(() => {
        actions.setSubmitting(false);

        navigate('/', {
          replace: true,
        });
      });
    },
  });

  if (isChecking) {
    return <Loading />;
  }

  return (
    <Grid container justifyContent="center" alignItems="center" height="100%">
      <Helmet title="Login" />
      <Paper variant="elevation" elevation={2} className={classes.paper}>
        <Grid item>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </Grid>
        <Grid item>
          <form onSubmit={formik.handleSubmit}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  type="email"
                  placeholder={t('email')}
                  fullWidth
                  name="email"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  placeholder={t('password')}
                  fullWidth
                  name="password"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  required
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={classes.submitBtn}
                  disabled={formik.isSubmitting}
                >
                  {t('login')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default observer(Login);

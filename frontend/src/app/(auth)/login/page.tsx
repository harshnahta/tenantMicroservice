'use client';
import { api } from '@/utils/api';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import React, { memo, useState } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useToast } from '@/providers/ToastProvider';
import * as Yup from 'yup';

// import LOGO from './Components/Logo';a

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  rememberme: Yup.boolean().required('Required'),
});

function Index() {
  const router = useRouter();
  const { showToast } = useToast();
  const [passwordType, setPasswordType] = useState(true);

  return (
    <>
      <div className="loginForm">
        <h2 className="text-capitalize">Login</h2>
        <Formik
          initialValues={{
            email: '',
            password: '',
            rememberme: false,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={LoginSchema}
          onSubmit={async (values: {
            subscription?: any;
            rememberme: boolean;
            email: string;
            password: string;
          }) => {
            try {
              const response = await api(
                {
                  url: `/auth/login`,
                  method: 'POST',
                  data: {
                    email: values.email,
                    password: values.password,
                    rememberme: values.rememberme,
                  },
                },
                true
              );
              if (response?.data?.status) {
                let now = new Date();
                let time = now.getTime();
                const secondsUntilEndOfMinute = 24 * 60 * 60;
                let expireTime = time + 1000 * secondsUntilEndOfMinute;
                now.setTime(expireTime);
                const token = response.data.accessToken;
                document.cookie = `jwt=${token};expires=${now.toUTCString()};path=/`;
                showToast('Login Successfull!');
                router.push(`/`);
                router.refresh();
              } else {
                showToast(
                  response?.response?.data?.message ?? 'Invalid Request'
                );
              }
            } catch (e) {
              console.log('error', e);
            }
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Label>Your email address</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Your email address"
                      onChange={handleChange}
                      value={values.email}
                      isInvalid={!!errors.email}
                    />
                    <InputGroup.Text>
                      <i role="button" className={'fa fa-user'}></i>
                    </InputGroup.Text>
                    {errors.email && touched.email ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    ) : null}
                  </InputGroup>
                </Col>
                <Col md={12}>
                  <Form.Label>Your password</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type={passwordType === true ? 'password' : 'text'}
                      name="password"
                      placeholder="Your password"
                      onChange={handleChange}
                      value={values.password}
                      isInvalid={!!errors.password}
                    />
                    <InputGroup.Text>
                      <i
                        role="button"
                        className={
                          passwordType === true
                            ? 'fa fa-eye-slash'
                            : 'fa fa-eye'
                        }
                        onClick={() => setPasswordType(!passwordType)}
                      ></i>
                    </InputGroup.Text>
                    {errors.password && touched.password ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    ) : null}
                  </InputGroup>
                </Col>
                <div className="d-flex justify-content-between">
                  <div>
                    <Form.Group className="rememberMe">
                      <Form.Check
                        type="checkbox"
                        name="rememberme"
                        label="Remember me"
                        onChange={handleChange}
                        isInvalid={!!errors.rememberme}
                        feedback={errors.rememberme}
                        feedbackType="invalid"
                      />
                      {errors.rememberme && touched.rememberme ? (
                        <Form.Control.Feedback type="invalid">
                          {errors.rememberme}
                        </Form.Control.Feedback>
                      ) : null}
                    </Form.Group>
                  </div>
                  <div className="forgot">
                    <Link href="/signup">Signup</Link>
                  </div>
                </div>
                <Col md={12}>
                  <Button type="submit" className="loginBtn customBtn">
                    Login
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

// Index.auth = false;
export default memo(Index);

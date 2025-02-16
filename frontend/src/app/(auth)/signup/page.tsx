'use client';
import { api } from '@/utils/api';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

import React, { memo, useState } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useToast } from '@/providers/ToastProvider';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  firstname: Yup.string().required('Required'),
  lastname: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
});

function Index() {
  const router = useRouter();
  const { showToast } = useToast();
  const [passwordType, setPasswordType] = useState(true);

  return (
    <>
      <div className="loginForm">
        <h2 className="text-capitalize">Signup</h2>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            rememberme: false,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={SignupSchema}
          onSubmit={async (values: {
            subscription?: any;
            firstname: string;
            lastname: string;
            email: string;
            password: string;
          }) => {
            try {
              const response = await api(
                {
                  url: `/auth/register`,
                  method: 'POST',
                  data: {
                    email: values.email,
                    password: values.password,
                    firstname: values.firstname,
                    lastname: values.lastname,
                  },
                },
                true
              );
              console.log({ response });
              if (response?.id) {
                showToast('Register Successfull!');
                router.push('/login');
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
                  <Form.Label>First Name</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      name="firstname"
                      placeholder="First name"
                      onChange={handleChange}
                      value={values.firstname}
                      isInvalid={!!errors.firstname}
                    />
                    <InputGroup.Text>
                      <i role="button" className={'fa fa-user'}></i>
                    </InputGroup.Text>
                    {errors.firstname && touched.firstname ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.firstname}
                      </Form.Control.Feedback>
                    ) : null}
                  </InputGroup>
                </Col>
                <Col md={12}>
                  <Form.Label>Last Name</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      name="lastname"
                      placeholder="last name"
                      onChange={handleChange}
                      value={values.lastname}
                      isInvalid={!!errors.lastname}
                    />
                    <InputGroup.Text>
                      <i role="button" className={'fa fa-user'}></i>
                    </InputGroup.Text>
                    {errors.lastname && touched.lastname ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.lastname}
                      </Form.Control.Feedback>
                    ) : null}
                  </InputGroup>
                </Col>
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

                <Col md={12}>
                  <Button type="submit" className="loginBtn customBtn">
                    Signup
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

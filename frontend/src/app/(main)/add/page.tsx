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

const ADdSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  price: Yup.number().required('Required'),
});

function Index() {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <>
      <div className="loginForm">
        <h2 className="text-capitalize">Add Product</h2>
        <Formik
          initialValues={{
            title: '',
            description: '',
            price: 0,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={ADdSchema}
          onSubmit={async (values: {
            subscription?: any;
            title: string;
            description: string;
            price: number;
          }) => {
            try {
              const response = await api(
                {
                  url: `/product/add`,
                  method: 'POST',
                  data: {
                    title: values.title,
                    description: values.description,
                    price: values.price,
                  },
                },
                true,
                null,
                'product'
              );

              if (response?.id) {
                showToast('Product added Successfull!');
                router.push('/');
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
                  <Form.Label>Product Title</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Title"
                      onChange={handleChange}
                      value={values.title}
                      isInvalid={!!errors.title}
                    />
                    {errors.title && touched.title ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    ) : null}
                  </InputGroup>
                </Col>
                <Col md={12}>
                  <Form.Label>Description</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="textarea"
                      name="description"
                      placeholder="Description"
                      onChange={handleChange}
                      value={values.description}
                      isInvalid={!!errors.description}
                    />
                    {errors.description && touched.description ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    ) : null}
                  </InputGroup>
                </Col>
                <Col md={12}>
                  <Form.Label>Price</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="number"
                      name="price"
                      placeholder="Price"
                      onChange={handleChange}
                      value={values.price}
                      isInvalid={!!errors.price}
                    />
                    {errors.price && touched.price ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    ) : null}
                  </InputGroup>
                </Col>

                <Col md={12}>
                  <Button type="submit" className="loginBtn customBtn">
                    Add Product
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

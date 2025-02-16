'use client';
import { api } from '@/utils/api';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

import React, { memo } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useToast } from '@/providers/ToastProvider';
import * as Yup from 'yup';
import moment from 'moment';

const EditSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  dueDate: Yup.string().required('Required'),
});

function Index(props: any) {
  const { title, description, dueDate, id } = props;
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <>
      <div className="loginForm">
        <h2 className="text-capitalize">Edit Task</h2>
        <Formik
          initialValues={{
            title,
            description,
            dueDate: moment(dueDate).format('YYYY-MM-DD'),
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={EditSchema}
          onSubmit={async (values: {
            subscription?: any;
            title: string;
            description: string;
            dueDate: string;
          }) => {
            try {
              const response = await api(
                {
                  url: `/task/update/${id}`,
                  method: 'PUT',
                  data: {
                    title: values.title,
                    description: values.description,
                    dueDate: values.dueDate,
                  },
                },
                true
              );

              if (response?.id) {
                showToast('Task updated Successfull!');
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
                  <Form.Label>Task Title</Form.Label>
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
                  <Form.Label>Due Date</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="date"
                      name="dueDate"
                      placeholder="Due Date"
                      onChange={handleChange}
                      value={values.dueDate}
                      isInvalid={!!errors.dueDate}
                    />
                    {errors.dueDate && touched.dueDate ? (
                      <Form.Control.Feedback type="invalid">
                        {errors.dueDate}
                      </Form.Control.Feedback>
                    ) : null}
                  </InputGroup>
                </Col>

                <Col md={12}>
                  <Button type="submit" className="loginBtn customBtn">
                    Edit Task
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

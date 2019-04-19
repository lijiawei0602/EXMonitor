import React from 'react';
import './InitProject.less';
import { Form, Row, Col, Input, Button } from 'antd';
const FormItem = Form.Item;


class InitProject extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            projectName: '',
            projectNameInfo: {},
        }
    }
    render () {
        return (
            <div className="initProject">
                <Form>
                    <h3>填写项目名申请monitorId</h3>
                    <FormItem label="项目名称">
                        <Row>
                            <Col span="6">
                                <Input style={{height: '40px'}}></Input>
                            </Col>
                            <Col span="2" style={{ marginLeft: '10px'}}>
                                <Button style={{width: '100%', height: '40px'}} type="primary">申请</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default InitProject;
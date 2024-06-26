import { useRef, useState, useCallback } from "react";
import dayjs from "dayjs";

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  Upload,
  message,
} from "antd";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function FormGenerator({
  data,
  onFinish,
  id,
  size,
  layout,
  formStyle,
  labelCol,
  wrapperCol,
  hookForm,
  disabled,
}: any) {
  const formRef: any = useRef(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleChangeSingleImage = useCallback(
    async (info: any, name: string, uploadType: any) => {
      const file = info.file.originFileObj;

      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
      }

      console.log(isJpgOrPng, "isJpgOrPng");
      console.log(isLt2M, "isLt2m");
      try {
        const url: any = await getBase64(file);
        if (isJpgOrPng && isLt2M) {
          setImageUrl(url);
          // prettier-ignore
          formRef?.current?.setFieldValue(name,uploadType === "base64" ? url : file); //validate upload type
        } else {
          formRef?.current?.setFieldValue(name, undefined);
          setImageUrl("");
        }
        console.log("successfully");
      } catch (error) {
        console.log(error, "error generate base64 uploading");
      }
    },
    []
  );

  return (
    <div>
      <Form
        ref={formRef}
        form={hookForm}
        disabled={disabled}
        id={id}
        onFinishFailed={(failData) => console.log(failData)}
        onFinish={(value) => {
          //filter value formatted
          for (const objForm of data) {
            if (objForm.type === "date") {
              value[objForm.name] = dayjs(new Date(value[objForm.name])).format(
                objForm.payloadFormat
              );
            }
            if (objForm.type === "range") {
              value[objForm.name] = [
                dayjs(new Date(value[objForm.name][0])).format(
                  objForm.payloadFormat
                ),
                dayjs(new Date(value[objForm.name][1])).format(
                  objForm.payloadFormat
                ),
              ];
            }
          }
          onFinish(value);
        }}
        layout={layout}
        size={size}
        scrollToFirstError={{
          //make error visible in the middle
          behavior: "smooth",
          block: "center",
          inline: "center",
        }}
        // disabled={componentDisabled}
        style={{ ...formStyle }}
        labelCol={{ ...labelCol }}
        wrapperCol={{ ...wrapperCol }}
      >
        {data.map((res: any, i: number) => {
          //TEXT
          if (res?.type === "text")
            return (
              <Form.Item
                key={i}
                label={res?.label}
                name={res?.name}
                rules={res?.rules}
              >
                <Input
                  placeholder={res?.placeholder}
                  className={res?.className}
                />
              </Form.Item>
            );
          //EMAIL
          if (res.type === "email") {
            return (
              <Form.Item
                key={i}
                label={res.label}
                name={res.name}
                rules={[
                  ...res.rules,
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input
                  placeholder={res.placeholder}
                  className={res?.className}
                />
              </Form.Item>
            );
          }
          //PASSWORD
          if (res.type === "password") {
            return (
              <Form.Item
                key={i}
                label={res?.label}
                name={res?.name}
                rules={res?.rules}
              >
                <Input.Password
                  className={res?.className}
                  placeholder={res?.placeholder}
                />
              </Form.Item>
            );
          }
          //CONFIRM PASSWORD
          if (res.type === "confirm_password") {
            return (
              <Form.Item
                key={i}
                label={res?.label}
                name={res?.name}
                rules={[
                  ...res?.rules,
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue(res.confirmationWith) === value
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  className={res?.className}
                  placeholder={res?.placeholder}
                />
              </Form.Item>
            );
          }
          //NUMBER
          if (res?.type === "number") {
            return (
              <Form.Item
                key={i}
                label={res?.label}
                name={res?.name}
                rules={res?.rules}
              >
                <InputNumber
                  style={{ minWidth: 140 }}
                  placeholder={res?.placeholder}
                  min={res?.min}
                  max={res?.max}
                  className={res?.className}
                />
              </Form.Item>
            );
          }
          //TEL
          if (res?.type === "tel") {
            return (
              <Form.Item
                key={i}
                label={res?.label}
                name={res?.name}
                rules={res?.rules}
              >
                <Input
                  placeholder={res?.placeholder}
                  className={res?.className}
                />
              </Form.Item>
            );
          }
          //SELECT
          if (res?.type === "select")
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                rules={res?.rules}
              >
                <Select
                  placeholder={res.placeholder}
                  className={res?.className}
                  // maxTagCount="responsive"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={res.options}
                  onChange={res?.onChange}
                />
              </Form.Item>
            );
          if (res?.type === "checkbox") {
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                rules={res?.rules}
              >
                <Checkbox.Group>
                  {res.options.map((option: any, optIdx: number) => (
                    <Checkbox key={optIdx} value={option.value}>
                      {option.label}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            );
          }
          //CHECKBOX BOOLEAN
          if (res?.type === "checkbox_boolean") {
            return (
              <Form.Item
                label={res.label}
                // className="mb-0"
                style={res.overideStyle}
                key={i}
                name={res.name}
                rules={res?.rules}
                valuePropName="checked"
              >
                <Checkbox key={i}>{res?.labelCheckbox}</Checkbox>
              </Form.Item>
            );
          }
          //RADIO
          if (res?.type === "radio") {
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                rules={res?.rules}
              >
                <Radio.Group className={res?.className}>
                  {res.options.map((option: any, optIdx: number) => (
                    <Radio key={optIdx} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            );
          }
          //SLIDER
          if (res?.type === "slider") {
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                rules={res?.rules}
                initialValue={res.min}
              >
                <Slider min={res.min} max={res.max} />
              </Form.Item>
            );
          }
          // //SWITCH
          if (res?.type === "switch") {
            const isValueTrue = Form.useWatch(res?.name, hookForm);
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                rules={res?.rules}
                valuePropName="checked"
                initialValue
              >
                <Switch
                  style={{
                    background: isValueTrue ? "green" : "gray",
                  }}
                  checkedChildren={res?.checkedChildren}
                  unCheckedChildren={res?.unCheckedChildren}
                />
              </Form.Item>
            );
          }
          //DATE
          if (res?.type === "date") {
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                // className={res?.className}
                rules={res?.rules}
              >
                <DatePicker
                  format={res.previewFormat}
                  className={res?.className}
                  disabledDate={(current) => {
                    return (
                      (current &&
                        current < dayjs(res?.minDate, "YYYY-MM-DD")) ||
                      current > dayjs(res?.maxDate, "YYYY-MM-DD")
                    );
                  }}
                />
              </Form.Item>
            );
          }
          //RANGE DATE PICKER
          if (res?.type === "range") {
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                rules={res?.rules}
              >
                <RangePicker
                  className={res?.className}
                  format={res.previewFormat}
                  disabledDate={(current) => {
                    return (
                      (current &&
                        current < dayjs(res?.minDate, "YYYY-MM-DD")) ||
                      current > dayjs(res?.maxDate, "YYYY-MM-DD")
                    );
                  }}
                />
              </Form.Item>
            );
          }
          //TEXTAREA
          if (res?.type === "textarea") {
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                rules={res?.rules}
              >
                <TextArea className={res?.className} />
              </Form.Item>
            );
          }
          //SINGLE IMAGE
          if (res.type === "single_image") {
            return (
              <Form.Item
                label={res.label}
                key={i}
                name={res.name}
                rules={res?.rules}
                valuePropName="string || {}"
              >
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={() => {}}
                  showUploadList={false}
                  accept="image/png, image/jpg, image/jpeg"
                  multiple
                  onChange={(info) =>
                    handleChangeSingleImage(info, res.name, res?.uploadType)
                  }
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                        objectFit: "contain",
                        aspectRatio: "1/1",
                      }}
                    />
                  ) : (
                    <Button>Upload</Button>
                  )}
                </Upload>
              </Form.Item>
            );
          }
          if (res?.type === "separator") {
            return (
              <>
                <h3 className={`text-center ${res?.className} py-5`}>
                  {res?.label}
                </h3>
              </>
            );
          }
          return null;
        })}
      </Form>
    </div>
  );
}

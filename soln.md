# (1)**Simple Mode** ( DONE) apart from out-standing

- [x] Users can create an account with:
      email address
      password
      full name -
  ### ADD AUTHENTICATION ---- DONE

### The above is done but (authentication) needs to be inforced

- [x] Users can upload files up to 200mb ----> DONE
- [x] ????Users can download uploaded files
      download works but issues > needs to point to the os envrionment to drop file
      not the codebase
- [x] Users can create folders to hold files ====> pass this as a params ==>> DONE

### HARD MODE

- [ ] An admin user type for managing the content uploaded // This will Involve authorization

### Task (ongoing)

- [ ] Admins can mark pictures and videos as unsafe //authorization goes in here
- [ ] Unsafe files automatically get deleted
- [ ] Users can stream videos and audio

### Envr variables to be provided

- JWT_PRIVATE_KEY=
- CLOUD_NAME=
- CLOUD_API_KEY=
- CLOUD_API_SECRET=

> [!NOTE]
> ??>>const maxSize = 200 x (1024 x 1024); // this equivalent to 200mb >>I'm not sure what this conversion is.
> Check on John Smilga Course to re-confirm how it came about.
> https://nodejs.org/api/buffer.html#buffer_class_method_buffer_bytelength_string_encoding > https://stackoverflow.com/questions/46959556/byte-size-of-buffer-javascript-node

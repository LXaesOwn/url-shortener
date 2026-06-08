import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { shortenUrl } from '../api/client';
import { setLoading, setCurrentUrl, setError } from '../store/urlSlice';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import styles from './UrlForm.module.css';

interface FormValues {
  url: string;
}

export const UrlForm: React.FC = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      url: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    let finalUrl = data.url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await shortenUrl(finalUrl);
      dispatch(setCurrentUrl(result));
      reset();
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to shorten URL'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleExample = () => {
    reset({ url: 'https://www.google.com' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        {...register('url', { 
          required: 'URL is required',
          maxLength: { value: 2048, message: 'URL is too long' }
        })}
        placeholder="Enter your long URL here (e.g., https://example.com)"
        error={errors.url?.message}
      />
      
      <div className={styles.buttonGroup}>
        <Button type="submit" loading={isSubmitting} variant="primary">
          🔗 Shorten URL
        </Button>
        <Button type="button" variant="secondary" onClick={handleExample}>
          📝 Example
        </Button>
      </div>
    </form>
  );
};
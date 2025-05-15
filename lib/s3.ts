import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuração do cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
});

// Nome do bucket
const bucketName = process.env.AWS_S3_BUCKET as string;

/**
 * Faz upload de um arquivo para o S3
 * @param file - Buffer ou stream do arquivo
 * @param key - Caminho/nome do arquivo no S3
 * @param contentType - Tipo de conteúdo do arquivo (ex: 'image/jpeg')
 * @returns URL do arquivo no S3
 */
export async function uploadToS3(file: Buffer, key: string, contentType: string): Promise<string> {
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  
  // Retorna a URL do objeto
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Gera uma URL assinada para um objeto do S3 (para download temporário)
 * @param key - Caminho/nome do arquivo no S3
 * @param expiresIn - Tempo de expiração em segundos (padrão: 3600 = 1 hora)
 * @returns URL assinada para acesso temporário
 */
export async function getSignedUrlForObject(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Exclui um objeto do S3
 * @param key - Caminho/nome do arquivo no S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  const deleteParams = {
    Bucket: bucketName,
    Key: key
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
}

/**
 * Constrói a URL completa para um objeto no S3
 * @param key - Caminho/nome do arquivo no S3
 * @returns URL completa do S3
 */
export function getS3Url(key: string): string {
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
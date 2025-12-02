# ALTER TABLE ACR_ACREEDORES_DEUDAS ADD Procesado BIT NOT NULL DEFAULT 0;

# CREATE TABLE SGO_FINANCIERO_OPT_PARAM (
#     id INT IDENTITY(1,1) PRIMARY KEY,
#     fechaVencimientoCalcInt INT DEFAULT 1,
# );

# INSERT INTO SGO_FINANCIERO_OPT_PARAM DEFAULT VALUES;

# USE [CARTIMEX]
# GO
# /****** Object:  StoredProcedure [dbo].[SGO_AMORTIZACION_ACR_INSERT]    Script Date: 1/12/2025 16:32:58 ******/
# SET ANSI_NULLS ON
# GO
# SET QUOTED_IDENTIFIER ON
# GO
# -- =============================================
# -- Author:		<Author,,Name>
# -- Create date: <Create Date,,>
# -- Description:	<Description,,>
# -- =============================================
# ALTER PROCEDURE [dbo].[SGO_AMORTIZACION_ACR_INSERT]
# @acreedorid    VARCHAR(10),
# @documentoID   VARCHAR(10),
# @asientoID     VARCHAR(10),
# @detalle       VARCHAR(200),
# @valor         MONEY,
# @fecha         DATETIME,
# @vencimiento   DATETIME,
# @rubroid       VARCHAR(10),
# @CuentaID      VARCHAR(10),
# @saldo         MONEY,
# @creadoPor     VARCHAR(15),
# @tipo CHAR(10) = 'ACR-AM',
# @procesado BIT = 0

# AS
# BEGIN
#     SET NOCOUNT ON;

#     DECLARE 
#         @ID INT,
#         @NuevoID VARCHAR(10)

#         -- Obtener el valor actual (suponiendo que es numérico)
#         SELECT @ID = CAST(Valor AS INT)
#         FROM sis_contadores
#         WHERE Código LIKE '%ACR_ACREEDORES_DEUDAS-ID-00%';

#         IF @ID IS NULL
#         BEGIN
#             RAISERROR('No se encontró el contador para ACR_ACREEDORES_DEUDAS.', 16, 1);
#             ROLLBACK TRAN;
#             RETURN;
#         END

#         -- Incrementar el valor
#         SET @ID = @ID + 1;

#         -- Formatear a 10 dígitos con ceros a la izquierda
#         SET @NuevoID = RIGHT(REPLICATE('0', 10) + CAST(@ID AS VARCHAR(10)), 10);

#         -- Insertar el registro principal
#         INSERT INTO ACR_ACREEDORES_DEUDAS (
#             ID,
#             acreedorID,
#             DocumentoID,
#             AsientoID,
#             Número,
#             detalle,
#             Valor,
#             Valor_Base,
#             Fecha,
#             Vencimiento,
#             RubroID,
#             CuentaID,
#             DivisaID,
#             Saldo,
#             Tipo,
#             CreadoPor,
#             CreadoDate,
#             SucursalID,
# 			DeudaID,
# 			Cambio,
#             Procesado
#         )
#         VALUES (
#             @NuevoID,
#             @acreedorid,
#             @documentoID,
#             @asientoID,
#             @documentoID,
#             @detalle,
#             @valor,
#             @valor,
#             @fecha,
#             @vencimiento,
#             @rubroid,
#             @CuentaID,
#             '0000000001',
#             @saldo,
#             @tipo,
#             @creadoPor,
#             GETDATE(),
#             '00',
# 			'',
# 			1,
#             @procesado
#         );


#         -- Actualizar el contador SOLO si el insert fue exitoso
#         UPDATE sis_contadores
#         SET Valor = @NuevoID
#         WHERE Código LIKE '%ACR_ACREEDORES_DEUDAS-ID-00%';

       
    
# END;


from datetime import datetime
import pyodbc

def conectar_base_datos():
    try:
        conexion = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=10.5.1.22;"
            "DATABASE=CARTIMEX;"
            "UID=jalvarado;"
            "PWD=12345;"
            "TrustServerCertificate=yes;"
        )
        return conexion
    
    except Exception as e:
        print(f"Error al conectar: {e}")
        return None

def select_opt_param(conexion):
    try:
        cursor = conexion.cursor()
        query = "SELECT * FROM SGO_FINANCIERO_OPT_PARAM"
        cursor.execute(query)
        resultados = cursor.fetchone()
        cursor.close()
        return resultados
    except Exception as e:
        print(f"Error en la consulta: {e}")
        return None

def fetch_dict(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]

def obtener_filas_con_interes(conexion):
    try:
        cursor = conexion.cursor()
        query = """
            SELECT d.*, dt.interes
            FROM ACR_ACREEDORES_DEUDAS d
            INNER JOIN SGO_AMORTIZACION_DT dt
                    ON dt.ACR_ID = d.ID
            WHERE d.Tipo = 'ACR-AM'
              AND dt.interes > 0
              AND MONTH(d.Vencimiento) = MONTH(GETDATE())
              AND YEAR(d.Vencimiento) = YEAR(GETDATE())
              AND (d.Procesado = 0 OR d.Procesado IS NULL)
            ORDER BY d.ID DESC;
        """
        cursor.execute(query)
        filas = fetch_dict(cursor)
        cursor.close()
        return filas
    except Exception as e:
        print("Error consultando:", e)
        return []

def ejecutar_sp_insert(conexion, fila):
    try:
        cursor = conexion.cursor()
        cursor.execute("""
            EXEC SGO_AMORTIZACION_ACR_INSERT
                @acreedorid=?,
                @documentoID=?,
                @asientoID=?,
                @detalle=?,
                @valor=?,
                @fecha=?,
                @vencimiento=?,
                @rubroid=?,
                @CuentaID=?,
                @saldo=?,
                @creadoPor=?,
                @tipo='ACR-AM-IN',
                @procesado=1
        """, (
            fila['AcreedorID'],
            fila['DocumentoID'],
            fila['AsientoID'],
            fila['Detalle'],
            fila['interes'],
            fila['Fecha'],
            fila['Vencimiento'],
            fila['RubroID'],
            fila['CuentaID'],
            fila['Saldo'],
            fila['CreadoPor']
        ))
        conexion.commit()
        cursor.close()
    except Exception as e:
        print("Error al ejecutar SP:", e)

def marcar_original_procesado(conexion, deuda_id):
    try:
        cursor = conexion.cursor()
        cursor.execute(
            "UPDATE ACR_ACREEDORES_DEUDAS SET Procesado = 1 WHERE ID = ?",
            deuda_id
        )
        conexion.commit()
        cursor.close()
    except Exception as e:
        print("Error marcando original procesado:", e)


if __name__ == "__main__":
    conexion = conectar_base_datos()

    if conexion:
        parametro = select_opt_param(conexion)
        dia_hoy = datetime.now().day

        if parametro[1] == dia_hoy:
            filas = obtener_filas_con_interes(conexion)
            print(f"Filas a procesar: {len(filas)}")
            for fila in filas:
                ejecutar_sp_insert(conexion, fila)
                marcar_original_procesado(conexion, fila['ID'])

            print("Proceso completado correctamente.")
        else:
            print("El día no coincide. No se ejecuta nada.")

        conexion.close()

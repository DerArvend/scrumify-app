USE [scrumify]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[report-task](
	[Id] [uniqueidentifier] NOT NULL,
	[ReportId] [uniqueidentifier] NOT NULL,
	[Theme] [nvarchar](max) NOT NULL,
	[Url] [nvarchar](max) NOT NULL,
	[CurrentState] [nvarchar](max) NULL,
	[Problems] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO